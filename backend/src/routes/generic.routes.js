import express from 'express';
import {
  getList,
  getDetail,
  createRecord
} from '../controllers/generic.controller.js';

const router = express.Router();

router.get('/:entity', getList);
router.get('/:entity/:id', getDetail);
//router.post('/:entity', createRecord);

export default router;
