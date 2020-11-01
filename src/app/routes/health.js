import { Router } from 'express';

const router = new Router();

router.route('/health').get(
  (_req, res) => {
    res.status(200).json({
      appName: 'RESTGuide',
      version: process.env.npm_package_version,
      status: 'OK',
    });
  }
);

export default router;