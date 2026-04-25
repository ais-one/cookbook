import * as realServices from '@common/node/services';

// biome-ignore lint/suspicious/noExplicitAny: services interface varies by store type
let services: any = realServices;

// Allows unit tests to inject a mock without needing ESM module mocking
// biome-ignore lint/suspicious/noExplicitAny: test injection
export const _injectServices = (mock: any) => {
  services = mock;
};

const create = async (req, res, next) => {
  const rv = await services.get('knex1')('categories').insert(req.body);
  return res.status(201).json({ id: rv[0] });
};

const findOne = async (req, res, next) => {
  const category = await services.get('knex1')('categories').where({ id: req.params.id }).first();
  if (category) return res.status(200).json(category);
  else return res.status(404).json({});
};

const update = async (req, res, next) => {
  const count = await services.get('knex1')('categories').where({ id: req.params.id }).update(req.body);
  return res.status(count ? 200 : 404).json({ count });
};

const find = async (req, res, next) => {
  const limit = req.query.limit ? req.query.limit : 2;
  const page = req.query.page ? req.query.page : 0;
  const categories = await services
    .get('knex1')('categories')
    .limit(limit)
    .offset((page > 0 ? page - 1 : 0) * limit);
  return res.status(200).json(categories);
};

const remove = async (req, res, next) => {
  const count = await services.get('knex1').knex('categories').where({ id: req.params.id }).delete();
  return res.status(count ? 200 : 404).json({ count });
};

export default {
  create,
  findOne,
  update,
  find,
  remove,
};
