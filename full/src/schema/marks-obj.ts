/**
 * @additionalProperties true
 */
export interface MarksObject<T> {
  marks?: Array<T>;
}

/**
 * @additionalProperties true
 */
export interface NoMark {
  /**
   * @maxItems 0
   */
  marks?: Array<any>;
}
