import {defineArrayMember} from 'sanity'

/**
 * Every rich text option the Studio offers, each defined once so its title and
 * value read the same in every editor.  A field opts into a subset of them with
 * `richTextBlock()`; adding an option here makes it available, not enabled.
 *
 * Each option a field enables also needs a renderer on the frontend.
 */

const STYLES = {
  normal: {title: 'Normal', value: 'normal'},
  h1: {title: 'Encabezado 1', value: 'h1'},
  h2: {title: 'Encabezado 2', value: 'h2'},
  h3: {title: 'Encabezado 3', value: 'h3'},
  h4: {title: 'Encabezado 4', value: 'h4'},
  h5: {title: 'Encabezado 5', value: 'h5'},
  h6: {title: 'Encabezado 6', value: 'h6'},
  blockquote: {title: 'Cita', value: 'blockquote'},
}

const LISTS = {
  bullet: {title: 'Lista con viñetas', value: 'bullet'},
  number: {title: 'Lista numerada', value: 'number'},
}

const DECORATORS = {
  strong: {title: 'Negrita', value: 'strong'},
  em: {title: 'Cursiva', value: 'em'},
  underline: {title: 'Subrayado', value: 'underline'},
  'strike-through': {title: 'Tachado', value: 'strike-through'},
  code: {title: 'Código', value: 'code'},
}

const ANNOTATIONS = {
  // The shared `link` object: a URL or an internal page.
  link: defineArrayMember({type: 'link', title: 'Enlace'}),
}

type RichTextOptions = {
  styles?: (keyof typeof STYLES)[]
  lists?: (keyof typeof LISTS)[]
  decorators?: (keyof typeof DECORATORS)[]
  annotations?: (keyof typeof ANNOTATIONS)[]
}

const keys = <T extends object>(options: T) => Object.keys(options) as (keyof T)[]

const ALL: Required<RichTextOptions> = {
  styles: keys(STYLES),
  lists: keys(LISTS),
  decorators: keys(DECORATORS),
  annotations: keys(ANNOTATIONS),
}

/**
 * A text block for use in a rich text field's `of`.
 *
 * With no argument, every option is allowed, including any added later.  With
 * an object, only the options it lists are allowed: a kind left out allows none
 * of that kind, so `{}` is plain paragraphs.  Sanity keeps the normal style
 * available even when `styles` is empty.
 */
export const richTextBlock = (options?: RichTextOptions) => {
  const {styles = [], lists = [], decorators = [], annotations = []} = options ?? ALL

  return defineArrayMember({
    type: 'block',
    styles: styles.map((key) => STYLES[key]),
    lists: lists.map((key) => LISTS[key]),
    marks: {
      decorators: decorators.map((key) => DECORATORS[key]),
      annotations: annotations.map((key) => ANNOTATIONS[key]),
    },
  })
}
