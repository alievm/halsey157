const Vote = require('../models/Vote');

// Создать новое голосование
exports.createVote = async (req, res) => {
    try {
        const { title, options } = req.body;
        const newVote = new Vote({ title, options });
        await newVote.save();
        res.status(201).json(newVote);
    } catch (error) {
        res.status(500).json({ error: 'Error creating vote' });
    }
};

// Получить все голосования
exports.getVotes = async (req, res) => {
    try {
        const votes = await Vote.find();
        res.status(200).json(votes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching votes' });
    }
};

exports.toggleVoteActiveStatus = async (req, res) => {
    try {
        const { id } = req.params; // ID голосования из параметров запроса
        const { isActive } = req.body; // Новое состояние активности из тела запроса

        const vote = await Vote.findById(id);
        if (!vote) {
            return res.status(404).json({ error: 'Vote not found' });
        }

        vote.isActive = isActive;
        await vote.save();

        res.status(200).json({ message: `Vote ${isActive ? 'activated' : 'deactivated'}`, vote });
    } catch (error) {
        res.status(500).json({ error: 'Error toggling vote active status' });
    }
};


// Контроллер для удаления голосования с использованием deleteOne
exports.deleteVote = async (req, res) => {
    try {
        const { id } = req.params; // Получаем ID голосования из параметров запроса
        console.log('Attempting to delete vote with id:', id); // Логируем ID

        const vote = await Vote.findById(id);
        if (!vote) {
            return res.status(404).json({ error: 'Vote not found' });
        }

        // Удаляем голосование
        await Vote.deleteOne({ _id: id });

        res.status(200).json({ message: 'Vote deleted successfully' });
    } catch (error) {
        console.error('Error:', error); // Логируем ошибку
        res.status(500).json({ error: 'Error deleting vote' });
    }
};


// Проголосовать за вариант
exports.voteOption = async (req, res) => {
    try {
        const { id, optionIndex } = req.body; // ID голосования и индекс варианта
        const vote = await Vote.findById(id);
        if (!vote) {
            return res.status(404).json({ error: 'Vote not found' });
        }
        vote.options[optionIndex].votes += 1;
        await vote.save();
        res.status(200).json(vote);
    } catch (error) {
        res.status(500).json({ error: 'Error updating vote' });
    }
};
