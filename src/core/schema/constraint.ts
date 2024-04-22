export type IndexMethod = 'BTREE' | 'HASH'

export interface IndexField {
  name: string
  length?: number
  order?: 'ASC' | 'DESC'
  collate?: string
  operator?: string
}

export interface IndexesOptions {
  id: string
  /**
   * The name of the index. Defaults to model name + _ + fields concatenated
   */
  name: string

  /**
   * Should the index by unique? Can also be triggered by setting type to `UNIQUE`
   *
   * @default false
   */
  unique?: boolean

  /**
   * An array of the fields to index. Each field can either be a string containing the name of the field,
   * a sequelize object (e.g `sequelize.fn`), or an object with the following attributes: `name`
   * (field name), `length` (create a prefix index of length chars), `order` (the direction the column
   * should be sorted in), `collate` (the collation (sort order) for the column), `operator` (likes IndexesOptions['operator'])
   */
  fields: Array<IndexField>

  /**
   * The method to create the index by (`USING` statement in SQL). BTREE and HASH are supported by mysql and
   * postgres, and postgres additionally supports GIST, SPGIST, BRIN and GIN.
   */
  using: IndexMethod

  /**
   * Prefix to append to the index name.
   */
  prefix?: string
}
