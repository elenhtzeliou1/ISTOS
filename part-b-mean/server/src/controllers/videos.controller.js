const Video = require('../models/video');

exports.getAllVideos = async(req,res,next) =>{
    try{
        const videos = await Video.find().lean();
        const normalized = videos.map(v=>({
            ...v,
            difficulty: v.difficulty || v.level
        }));

        res.status(200).json(normalized);
    }catch(err){
        next(err);
    }
};

exports.getVideoById = async (req,res,next)=>{
    try{
        const video = await Video.findById(req.params.id);
        if(!video){
            return res.status(404).json({message:'Video not Found'});
        }
        res.status(200).json(video)
    }catch(err){
        res.status(400).json({message:'Invalid Video id'});
    }
};
exports.getVideosByIds = async (req, res, next) => {
  try {
    const ids = String(req.query.ids || '')
      .split(',')
      .map(x => parseInt(x.trim(), 10))
      .filter(n => Number.isFinite(n));

    if (!ids.length) return res.json([]);

    const videos = await Video.find({ videoId: { $in: ids } }).lean();
    res.json(videos);
  } catch (err) {
    next(err);
  }
};

//get proposed videos
exports.getProposedVideos = async(req,res,next)=>{
    try{
        const limit = Math.min(parseInt(req.query.limit || '3',10),20);
        let proposed = await Video.find({featured:true}).limit(limit).lean();

        if(proposed.length <limit){
            const remaining = limit - proposed.length;
            const excludeIds = proposed.map(v=>v._id);

            const extras = await Video.find({
                featured:{$ne:true},
                _id:{$nin:excludeIds},

            }).limit(remaining).lean();
            proposed = proposed.concat(extras);
        }
        res.status(200).json(proposed);
    } catch(err){
        next(err);
    }
}