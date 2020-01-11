import routes from '../routes';
import Video from '../models/Video';
import Comment from '../models/Comment';

export const home = async (req, res) => {
	try {
		const videos = await Video.find({}).sort({ _id: -1 });
		res.render('home', { pageTitle: 'Home', videos });
	} catch (e) {
		console.log(e);
		res.render('home', { pageTitle: 'Home', videos: [] });
	}
};

export const search = async (req, res) => {
	const { query: { term: searchingBy } } = req;
	let videos = [];
	try {
		videos = await Video.find({
			title: { $regex: searchingBy, $options: 'i' }
		});
	} catch (e) {
		console.log(e);
	}
	res.render('search', { pageTitle: 'Search', searchingBy, videos });
};

export const getUpload = (req, res) => res.render('upload', { pageTitle: 'Upload' });

export const postUpload = async (req, res) => {
	try {
		const { user } = req;
		const { body: { title, description }, file: { path } } = req; //  { title, description, file }
		const newVideo = await Video.create({
			fileUrl: path,
			title,
			description,
			creator: user.id
		});
		user.videos.push(newVideo.id);
		req.user.save();
		res.redirect(routes.videoDetail(newVideo.id));
	} catch (e) {
		console.log(e);
	} finally {
		// To Do: Upload and save video.
		res.redirect(routes.home);
	}
};

export const videoDetail = async (req, res) => {
	const { params: { id } } = req;
	try {
		const video = await Video.findById(id).populate('creator').populate('comments');
		console.log(video);
		res.render('videoDetail', { pageTitle: video.title, video });
	} catch (e) {
		console.log(e);
		res.redirect(routes.home);
	}
};

export const getEditVideo = async (req, res) => {
	try {
		const { params: { id } } = req;
		const video = await Video.findById(id);
		res.render('editVideo', { pageTitle: `Edit ${video.title}`, video });
	} catch (e) {
		console.log(e);
	}
};

export const postEditVideo = async (req, res) => {
	const { params: { id }, body: { title, description } } = req;
	try {
		await Video.findOneAndUpdate({ _id: id }, { title, description });
		res.redirect(routes.videoDetail(id));
	} catch (e) {
		console.log(e);
		res.redirect(routes.home);
	}
};

export const deleteVideo = async (req, res) => {
	const { params: { id } } = req;
	try {
		await Video.findOneAndRemove({ _id: id });
	} catch (e) {
		console.log(e);
	} finally {
		res.redirect(routes.home);
	}
};

// Register Video View
export const postRegisterView = async (req, res) => {
	const { params: { id } } = req;
	try {
		const video = await Video.findById(id);
		video.views += 1;
		console.log('video: ', video.views);
		video.save();
		res.status(200);
	} catch (e) {
		console.log(e);
		res.status(400);
	} finally {
		res.end();
	}
};

export const postAddComment = async (req, res) => {
	const { params: { id }, body: { comment }, user } = req;
	try {
		const video = await Video.findById(id);
		const newComment = await Comment.create({
			text: comment,
			creator: user.id
		});
		video.comments.push(newComment.id);
		video.save();
	} catch (e) {
		console.log(e);
		res.status(400);
	} finally {
		res.end();
	}
};
