import schema from '@src/api/schema/examples/blog'
import { defaultDbOptions } from '@src/core/database'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  it('generates correct code for blog', () => {
    const code = SequelizeFramework.generate({
      schema,
      dbOptions: defaultDbOptions,
    })
    expect(code).toMatchSnapshot()
  })
})