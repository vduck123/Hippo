const { Op } = require('sequelize');
const db = require('../models/index');

class VideoController {
    async getAllVideos(req, res, next) {
        try {
            const videos = await db.Video.findAll({
                include: [
                    {
                        model: db.Account,
                        as: 'accounts',
                        attributes: ['id', 'nickname', 'avatar', 'tick']
                    },
                    {
                        model: db.Like,
                        as: 'likes',
                        attributes: ['acc_id']
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            });


            if (!videos || videos.length === 0) {
                return res.status(404).json({ message: "No video found" });
            }

            return res.status(200).json(videos);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getMyVideos(req, res, next) {
        try {
            const { acc_id } = req.params;
            console.log(acc_id);
            
            if (!acc_id) {
                return res.status(400).json({ message: 'Missing account_id parameter' });
            }

            const videos = await db.Video.findAll({
                where: {
                    acc_id
                },
                include: [
                    {
                        model: db.Account,
                        as: 'accounts',
                        attributes: ['id', 'nickname', 'avatar', 'tick']
                    },
                    {
                        model: db.Like,
                        as: 'likes',
                        attributes: ['acc_id']
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            if(videos) {
                return res.status(200).json(videos);
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }



    async createVideo(req, res, next) {
        console.log(req.body);
        
        try {
            const video = await db.Video.create(req.body);

            if (video) {
                
                const res_video = await db.Video.findOne({
                    where: {
                        id: video?.id
                    },
                    include: [
                        {
                            model: db.Account,
                            as: 'accounts',
                            attributes: ['id', 'nickname', 'avatar', 'tick']
                        }
                    ]
                })
                return res.status(201).json(res_video);
            }
            
        } catch (error) {
            res.status(501).json({ error });
        }
    }
    

}

module.exports = new VideoController();