const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const phoneExists = await User.findOne({ where: { phone } });
    if (phoneExists) return res.status(409).json({ error: 'Phone number already registered' });

    const user = await User.create({ name, email, phone, password });
    const token = generateToken(user.id);

    logger.info(`New user registered: ${email}`);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated. Contact support.' });
    }

    await user.update({ lastLogin: new Date() });
    const token = generateToken(user.id);

    logger.info(`User logged in: ${email}`);
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!(await req.user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    await req.user.update({ password: newPassword });
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const newToken = generateToken(user.id);
    res.json({ token: newToken });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next(err);
  }
};
