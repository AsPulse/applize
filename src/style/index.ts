export type CSSAbsoluteUnits = 'cm' | 'mm' | 'Q' | 'in' | 'pc' | 'pt' | 'px';
export type CSSRelativeUnits =
  | 'em'
  | 'ex'
  | 'ch'
  | 'rem'
  | 'lh'
  | 'vw'
  | 'vh'
  | 'vmin'
  | 'vmax';
export type CSSGlobal = 'unset' | 'initial' | 'inherit';

export class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number
  ) {}
  static fromHex(string: `#${string}`) {
    return new Color(
      parseInt(string[1] + string[2], 16),
      parseInt(string[3] + string[4], 16),
      parseInt(string[5] + string[6], 16),
      255
    );
  }
  static fromRGB(r: number, g: number, b: number) {
    return new Color(r, g, b, 255);
  }
  static fromRGBA(r: number, g: number, b: number, a: number) {
    return new Color(r, g, b, a);
  }
  alpha(alpha: number): Color {
    return new Color(this.r, this.g, this.b, alpha);
  }
  toRGB(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

export type Length = `${number}${CSSAbsoluteUnits | CSSRelativeUnits | '%'}`;
export type ratio = `${number}` | `${number}%`;

export class Cardinal<T> {
  ident = 'cardinal';
  constructor(
    public topValue: T | undefined,
    public bottomValue: T | undefined,
    public leftValue: T | undefined,
    public rightValue: T | undefined
  ) {}
  static fromAll<K>(value: K | undefined) {
    return new Cardinal<K>(value, value, value, value);
  }
  static fromVH<K>(UpAndDown: K | undefined, LeftAndRight: K | undefined) {
    return new Cardinal<K>(UpAndDown, UpAndDown, LeftAndRight, LeftAndRight);
  }
  top(value: T) {
    this.topValue = value;
    return this;
  }
  left(value: T) {
    this.leftValue = value;
    return this;
  }
  right(value: T) {
    this.rightValue = value;
    return this;
  }
  bottom(value: T) {
    this.bottomValue = value;
    return this;
  }
}

export class XY<T> {
  ident = 'xy';
  constructor(public xValue: T | undefined, public yValue: T | undefined) {}
  static fromAll<K>(value: K | undefined) {
    return new XY<K>(value, value);
  }
  x(value: T) {
    this.xValue = value;
    return this;
  }
  y(value: T) {
    this.yValue = value;
    return this;
  }
}

export class Quattuor<T> {
  ident = 'quattuor';
  constructor(
    public topLeftValue: T | undefined,
    public topRightValue: T | undefined,
    public bottomLeftValue: T | undefined,
    public bottomRightValue: T | undefined
  ) {}
  static fromAll<K>(value: K | undefined) {
    return new Quattuor<K>(value, value, value, value);
  }
  static fromTopAndBottom<K>(top: K | undefined, bottom: K | undefined) {
    return new Quattuor<K>(top, top, bottom, bottom);
  }
  static fromLeftAndRight<K>(left: K | undefined, right: K | undefined) {
    return new Quattuor<K>(left, right, left, right);
  }
  topLeft(value: T) {
    this.topLeftValue = value;
    return this;
  }
  bottomLeft(value: T) {
    this.bottomLeftValue = value;
    return this;
  }
  bottomRight(value: T) {
    this.bottomRightValue = value;
    return this;
  }
  topRight(value: T) {
    this.topRightValue = value;
    return this;
  }
}

type CSSNotImplemented = string;

type baselinePosition = 'baseline';
type contentDistribution =
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'stretch';
type overflowPosition = 'unsafe' | 'safe';
type contentPosition = 'center' | 'start' | 'end' | 'flex-start' | 'flex-end';
type selfPosition = contentPosition | 'self-start' | 'self-end';
type OptionalPrefix<Prefix extends string, Content extends string> =
  | Content
  | `${Prefix} ${Content};`;

interface Border {
  width: Length;
  color: Color;
  style:
    | 'none'
    | 'hidden'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset'
    | 'dotted'
    | 'dashed';
}

type RandomOrder3<A extends string, B extends string, C extends string> =
  | `${A} ${B} ${C}`
  | `${A} ${C} ${B}`
  | `${B} ${A} ${C}`
  | `${B} ${C} ${A}`
  | `${C} ${A} ${B}`
  | `${C} ${B} ${A}`;

type RandomOrder2<A extends string, B extends string> =
  | `${A} ${B}`
  | `${B} ${A}`;

type OptionalRandomOrder<
  A extends string,
  B extends string,
  Optional extends string
> = RandomOrder3<A, B, Optional> | RandomOrder2<A, B>;

type RandomOrderPartial<A extends string, B extends string> =
  | RandomOrder2<A, B>
  | A
  | B;

type displayOutside = 'block' | 'inline' | 'run-in';
type displayInside = 'flow' | 'flow-root' | 'table' | 'flex' | 'grid' | 'ruby';
type displayListItem = OptionalRandomOrder<
  'flow' | 'flow-root',
  'list-item',
  displayOutside
>;
type displayInternal =
  | 'table-row-group'
  | 'table-header-group'
  | 'table-footer-group'
  | 'table-row'
  | 'table-cell'
  | 'table-column-group'
  | 'table-column'
  | 'table-caption'
  | 'ruby-base'
  | 'ruby-text'
  | 'ruby-base-container'
  | 'ruby-text-container';
type displayBox = 'contents' | 'none';

export interface CSSKeyValue {
  accentColor: Color;
  alignContent:
    | 'normal'
    | OptionalPrefix<'first' | 'last', baselinePosition>
    | contentDistribution
    | `${overflowPosition} ${contentPosition}`
    | contentPosition;
  alignItems:
    | 'normal'
    | 'stretch'
    | baselinePosition
    | OptionalPrefix<overflowPosition, selfPosition>;
  alignSelf:
    | 'auto'
    | 'normal'
    | 'stretch'
    | baselinePosition
    | OptionalPrefix<overflowPosition, selfPosition>;
  alignmentBaseline:
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'hanging'
    | 'mathematical'
    | 'top'
    | 'center'
    | 'bottom';
  all: CSSNotImplemented;
  animation: CSSNotImplemented;
  animationDelay: CSSNotImplemented;
  animationDirection: CSSNotImplemented;
  animationDuration: CSSNotImplemented;
  animationFillMode: CSSNotImplemented;
  animationIterationCount: CSSNotImplemented;
  animationName: CSSNotImplemented;
  animationPlayState: CSSNotImplemented;
  animationTimingFunction: CSSNotImplemented;
  appearance: CSSNotImplemented;
  aspectRatio: CSSNotImplemented;
  backfaceVisibility: CSSNotImplemented;
  background: CSSNotImplemented;
  backgroundAttachment: CSSNotImplemented;
  backgroundBlendMode: CSSNotImplemented;
  backgroundClip: CSSNotImplemented;
  backgroundColor: Color;
  backgroundImage: CSSNotImplemented;
  backgroundOrigin: CSSNotImplemented;
  backgroundPosition: CSSNotImplemented;
  backgroundPositionX: CSSNotImplemented;
  backgroundPositionY: CSSNotImplemented;
  backgroundRepeat: CSSNotImplemented;
  backgroundSize: CSSNotImplemented;
  baselineShift: CSSNotImplemented;
  blockSize: CSSNotImplemented;
  border: Cardinal<Border>;
  borderBlock: CSSNotImplemented;
  borderBlockColor: CSSNotImplemented;
  borderBlockEnd: CSSNotImplemented;
  borderBlockEndColor: CSSNotImplemented;
  borderBlockEndStyle: CSSNotImplemented;
  borderBlockEndWidth: CSSNotImplemented;
  borderBlockStart: CSSNotImplemented;
  borderBlockStartColor: CSSNotImplemented;
  borderBlockStartStyle: CSSNotImplemented;
  borderBlockStartWidth: CSSNotImplemented;
  borderBlockStyle: CSSNotImplemented;
  borderBlockWidth: CSSNotImplemented;
  borderCollapse: CSSNotImplemented;
  borderEndEndRadius: CSSNotImplemented;
  borderEndStartRadius: CSSNotImplemented;
  borderImage: CSSNotImplemented;
  borderImageOutset: CSSNotImplemented;
  borderImageRepeat: CSSNotImplemented;
  borderImageSlice: CSSNotImplemented;
  borderImageSource: CSSNotImplemented;
  borderImageWidth: CSSNotImplemented;
  borderInline: CSSNotImplemented;
  borderInlineColor: CSSNotImplemented;
  borderInlineEnd: CSSNotImplemented;
  borderInlineEndColor: CSSNotImplemented;
  borderInlineEndStyle: CSSNotImplemented;
  borderInlineEndWidth: CSSNotImplemented;
  borderInlineStart: CSSNotImplemented;
  borderInlineStartColor: CSSNotImplemented;
  borderInlineStartStyle: CSSNotImplemented;
  borderInlineStartWidth: CSSNotImplemented;
  borderInlineStyle: CSSNotImplemented;
  borderInlineWidth: CSSNotImplemented;
  borderRadius: Quattuor<Length>;
  borderSpacing: CSSNotImplemented;
  borderStartEndRadius: CSSNotImplemented;
  borderStartStartRadius: CSSNotImplemented;
  bottom: CSSNotImplemented;
  boxShadow: CSSNotImplemented;
  boxSizing: CSSNotImplemented;
  breakAfter: CSSNotImplemented;
  breakBefore: CSSNotImplemented;
  breakInside: CSSNotImplemented;
  captionSide: CSSNotImplemented;
  caretColor: CSSNotImplemented;
  clear: CSSNotImplemented;
  /** @deprecated */
  clip: CSSNotImplemented;
  clipPath: CSSNotImplemented;
  clipRule: CSSNotImplemented;
  color: Color;
  colorInterpolation: CSSNotImplemented;
  colorInterpolationFilters: CSSNotImplemented;
  colorScheme: CSSNotImplemented;
  columnCount: CSSNotImplemented;
  columnFill: CSSNotImplemented;
  columnGap: CSSNotImplemented;
  columnRule: CSSNotImplemented;
  columnRuleColor: CSSNotImplemented;
  columnRuleStyle: CSSNotImplemented;
  columnRuleWidth: CSSNotImplemented;
  columnSpan: CSSNotImplemented;
  columnWidth: CSSNotImplemented;
  columns: CSSNotImplemented;
  contain: CSSNotImplemented;
  content: CSSNotImplemented;
  counterIncrement: CSSNotImplemented;
  counterReset: CSSNotImplemented;
  counterSet: CSSNotImplemented;
  cssFloat: CSSNotImplemented;
  cssText: CSSNotImplemented;
  cursor: CSSNotImplemented;
  direction: CSSNotImplemented;
  display:
    | RandomOrderPartial<displayOutside, displayInside>
    | displayListItem
    | displayInternal
    | displayBox;
  dominantBaseline: CSSNotImplemented;
  emptyCells: CSSNotImplemented;
  fill: CSSNotImplemented;
  fillOpacity: CSSNotImplemented;
  fillRule: CSSNotImplemented;
  filter: CSSNotImplemented;
  flex: CSSNotImplemented;
  flexBasis: CSSNotImplemented;
  flexDirection: CSSNotImplemented;
  flexFlow: CSSNotImplemented;
  flexGrow: CSSNotImplemented;
  flexShrink: CSSNotImplemented;
  flexWrap: CSSNotImplemented;
  float: CSSNotImplemented;
  floodColor: CSSNotImplemented;
  floodOpacity: CSSNotImplemented;
  font: CSSNotImplemented;
  fontFamily: CSSNotImplemented;
  fontFeatureSettings: CSSNotImplemented;
  fontKerning: CSSNotImplemented;
  fontOpticalSizing: CSSNotImplemented;
  fontSize: CSSNotImplemented;
  fontSizeAdjust: CSSNotImplemented;
  fontStretch: CSSNotImplemented;
  fontStyle: CSSNotImplemented;
  fontSynthesis: CSSNotImplemented;
  fontVariant: CSSNotImplemented;
  /** @deprecated */
  fontVariantAlternates: CSSNotImplemented;
  fontVariantCaps: CSSNotImplemented;
  fontVariantEastAsian: CSSNotImplemented;
  fontVariantLigatures: CSSNotImplemented;
  fontVariantNumeric: CSSNotImplemented;
  fontVariantPosition: CSSNotImplemented;
  fontVariationSettings: CSSNotImplemented;
  fontWeight: CSSNotImplemented;
  gap: CSSNotImplemented;
  grid: CSSNotImplemented;
  gridArea: CSSNotImplemented;
  gridAutoColumns: CSSNotImplemented;
  gridAutoFlow: CSSNotImplemented;
  gridAutoRows: CSSNotImplemented;
  gridColumn: CSSNotImplemented;
  gridColumnEnd: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `columnGap`. */
  gridColumnGap: CSSNotImplemented;
  gridColumnStart: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `gap`. */
  gridGap: CSSNotImplemented;
  gridRow: CSSNotImplemented;
  gridRowEnd: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `rowGap`. */
  gridRowGap: CSSNotImplemented;
  gridRowStart: CSSNotImplemented;
  gridTemplate: CSSNotImplemented;
  gridTemplateAreas: CSSNotImplemented;
  gridTemplateColumns: CSSNotImplemented;
  gridTemplateRows: CSSNotImplemented;
  height: CSSNotImplemented;
  hyphens: CSSNotImplemented;
  /** @deprecated */
  imageOrientation: CSSNotImplemented;
  imageRendering: CSSNotImplemented;
  inlineSize: CSSNotImplemented;
  inset: CSSNotImplemented;
  insetBlock: CSSNotImplemented;
  insetBlockEnd: CSSNotImplemented;
  insetBlockStart: CSSNotImplemented;
  insetInline: CSSNotImplemented;
  insetInlineEnd: CSSNotImplemented;
  insetInlineStart: CSSNotImplemented;
  isolation: CSSNotImplemented;
  justifyContent: CSSNotImplemented;
  justifyItems: CSSNotImplemented;
  justifySelf: CSSNotImplemented;
  left: CSSNotImplemented;
  readonly length: number;
  letterSpacing: CSSNotImplemented;
  lightingColor: CSSNotImplemented;
  lineBreak: CSSNotImplemented;
  lineHeight: CSSNotImplemented;
  listStyle: CSSNotImplemented;
  listStyleImage: CSSNotImplemented;
  listStylePosition: CSSNotImplemented;
  listStyleType: CSSNotImplemented;
  margin: Cardinal<Length>;
  marginBlock: CSSNotImplemented;
  marginBlockEnd: CSSNotImplemented;
  marginBlockStart: CSSNotImplemented;
  marginInline: CSSNotImplemented;
  marginInlineEnd: CSSNotImplemented;
  marginInlineStart: CSSNotImplemented;
  marker: CSSNotImplemented;
  markerEnd: CSSNotImplemented;
  markerMid: CSSNotImplemented;
  markerStart: CSSNotImplemented;
  mask: CSSNotImplemented;
  maskType: CSSNotImplemented;
  maxBlockSize: CSSNotImplemented;
  maxHeight: CSSNotImplemented;
  maxInlineSize: CSSNotImplemented;
  maxWidth: CSSNotImplemented;
  minBlockSize: CSSNotImplemented;
  minHeight: CSSNotImplemented;
  minInlineSize: CSSNotImplemented;
  minWidth: CSSNotImplemented;
  mixBlendMode: CSSNotImplemented;
  objectFit: CSSNotImplemented;
  objectPosition: CSSNotImplemented;
  offset: CSSNotImplemented;
  offsetAnchor: CSSNotImplemented;
  offsetDistance: CSSNotImplemented;
  offsetPath: CSSNotImplemented;
  offsetRotate: CSSNotImplemented;
  opacity: CSSNotImplemented;
  order: CSSNotImplemented;
  orphans: CSSNotImplemented;
  outline: CSSNotImplemented;
  outlineColor: CSSNotImplemented;
  outlineOffset: CSSNotImplemented;
  outlineStyle: CSSNotImplemented;
  outlineWidth: CSSNotImplemented;
  overflow: XY<Length>;
  overflowAnchor: CSSNotImplemented;
  overflowWrap: CSSNotImplemented;
  overscrollBehavior: CSSNotImplemented;
  overscrollBehaviorBlock: CSSNotImplemented;
  overscrollBehaviorInline: CSSNotImplemented;
  overscrollBehaviorX: CSSNotImplemented;
  overscrollBehaviorY: CSSNotImplemented;
  padding: Cardinal<Length>;
  paddingBlock: CSSNotImplemented;
  paddingBlockEnd: CSSNotImplemented;
  paddingBlockStart: CSSNotImplemented;
  paddingInline: CSSNotImplemented;
  paddingInlineEnd: CSSNotImplemented;
  paddingInlineStart: CSSNotImplemented;
  pageBreakAfter: CSSNotImplemented;
  pageBreakBefore: CSSNotImplemented;
  pageBreakInside: CSSNotImplemented;
  paintOrder: CSSNotImplemented;
  readonly parentRule: CSSRule | null;
  perspective: CSSNotImplemented;
  perspectiveOrigin: CSSNotImplemented;
  placeContent: CSSNotImplemented;
  placeItems: CSSNotImplemented;
  placeSelf: CSSNotImplemented;
  pointerEvents: CSSNotImplemented;
  position: CSSNotImplemented;
  quotes: CSSNotImplemented;
  resize: CSSNotImplemented;
  right: CSSNotImplemented;
  rotate: CSSNotImplemented;
  rowGap: CSSNotImplemented;
  rubyPosition: CSSNotImplemented;
  scale: CSSNotImplemented;
  scrollBehavior: CSSNotImplemented;
  scrollMargin: CSSNotImplemented;
  scrollMarginBlock: CSSNotImplemented;
  scrollMarginBlockEnd: CSSNotImplemented;
  scrollMarginBlockStart: CSSNotImplemented;
  scrollMarginBottom: CSSNotImplemented;
  scrollMarginInline: CSSNotImplemented;
  scrollMarginInlineEnd: CSSNotImplemented;
  scrollMarginInlineStart: CSSNotImplemented;
  scrollMarginLeft: CSSNotImplemented;
  scrollMarginRight: CSSNotImplemented;
  scrollMarginTop: CSSNotImplemented;
  scrollPadding: CSSNotImplemented;
  scrollPaddingBlock: CSSNotImplemented;
  scrollPaddingBlockEnd: CSSNotImplemented;
  scrollPaddingBlockStart: CSSNotImplemented;
  scrollPaddingBottom: CSSNotImplemented;
  scrollPaddingInline: CSSNotImplemented;
  scrollPaddingInlineEnd: CSSNotImplemented;
  scrollPaddingInlineStart: CSSNotImplemented;
  scrollPaddingLeft: CSSNotImplemented;
  scrollPaddingRight: CSSNotImplemented;
  scrollPaddingTop: CSSNotImplemented;
  scrollSnapAlign: CSSNotImplemented;
  scrollSnapStop: CSSNotImplemented;
  scrollSnapType: CSSNotImplemented;
  shapeImageThreshold: CSSNotImplemented;
  shapeMargin: CSSNotImplemented;
  shapeOutside: CSSNotImplemented;
  shapeRendering: CSSNotImplemented;
  stopColor: CSSNotImplemented;
  stopOpacity: CSSNotImplemented;
  stroke: CSSNotImplemented;
  strokeDasharray: CSSNotImplemented;
  strokeDashoffset: CSSNotImplemented;
  strokeLinecap: CSSNotImplemented;
  strokeLinejoin: CSSNotImplemented;
  strokeMiterlimit: CSSNotImplemented;
  strokeOpacity: CSSNotImplemented;
  strokeWidth: CSSNotImplemented;
  tabSize: CSSNotImplemented;
  tableLayout: CSSNotImplemented;
  textAlign: CSSNotImplemented;
  textAlignLast: CSSNotImplemented;
  textAnchor: CSSNotImplemented;
  textCombineUpright: CSSNotImplemented;
  textDecoration: CSSNotImplemented;
  textDecorationColor: CSSNotImplemented;
  textDecorationLine: CSSNotImplemented;
  textDecorationSkipInk: CSSNotImplemented;
  textDecorationStyle: CSSNotImplemented;
  textDecorationThickness: CSSNotImplemented;
  textEmphasis: CSSNotImplemented;
  textEmphasisColor: CSSNotImplemented;
  textEmphasisPosition: CSSNotImplemented;
  textEmphasisStyle: CSSNotImplemented;
  textIndent: CSSNotImplemented;
  textOrientation: CSSNotImplemented;
  textOverflow: CSSNotImplemented;
  textRendering: CSSNotImplemented;
  textShadow: CSSNotImplemented;
  textTransform: CSSNotImplemented;
  textUnderlineOffset: CSSNotImplemented;
  textUnderlinePosition: CSSNotImplemented;
  top: CSSNotImplemented;
  touchAction: CSSNotImplemented;
  transform: CSSNotImplemented;
  transformBox: CSSNotImplemented;
  transformOrigin: CSSNotImplemented;
  transformStyle: CSSNotImplemented;
  transition: CSSNotImplemented;
  transitionDelay: CSSNotImplemented;
  transitionDuration: CSSNotImplemented;
  transitionProperty: CSSNotImplemented;
  transitionTimingFunction: CSSNotImplemented;
  translate: CSSNotImplemented;
  unicodeBidi: CSSNotImplemented;
  userSelect: CSSNotImplemented;
  verticalAlign: CSSNotImplemented;
  visibility: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `alignContent`. */
  webkitAlignContent: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `alignItems`. */
  webkitAlignItems: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `alignSelf`. */
  webkitAlignSelf: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `animation`. */
  webkitAnimation: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `animationDelay`. */
  webkitAnimationDelay: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `animationDirection`. */
  webkitAnimationDirection: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `animationDuration`. */
  webkitAnimationDuration: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `animationFillMode`. */
  webkitAnimationFillMode: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `animationIterationCount`. */
  webkitAnimationIterationCount: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `animationName`. */
  webkitAnimationName: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `animationPlayState`. */
  webkitAnimationPlayState: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `animationTimingFunction`. */
  webkitAnimationTimingFunction: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `appearance`. */
  webkitAppearance: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `backfaceVisibility`. */
  webkitBackfaceVisibility: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `backgroundClip`. */
  webkitBackgroundClip: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `backgroundOrigin`. */
  webkitBackgroundOrigin: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `backgroundSize`. */
  webkitBackgroundSize: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `borderBottomLeftRadius`. */
  webkitBorderBottomLeftRadius: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `borderBottomRightRadius`. */
  webkitBorderBottomRightRadius: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `borderRadius`. */
  webkitBorderRadius: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `borderTopLeftRadius`. */
  webkitBorderTopLeftRadius: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `borderTopRightRadius`. */
  webkitBorderTopRightRadius: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `boxAlign`. */
  webkitBoxAlign: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `boxFlex`. */
  webkitBoxFlex: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `boxOrdinalGroup`. */
  webkitBoxOrdinalGroup: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `boxOrient`. */
  webkitBoxOrient: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `boxPack`. */
  webkitBoxPack: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `boxShadow`. */
  webkitBoxShadow: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `boxSizing`. */
  webkitBoxSizing: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `filter`. */
  webkitFilter: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `flex`. */
  webkitFlex: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `flexBasis`. */
  webkitFlexBasis: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `flexDirection`. */
  webkitFlexDirection: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `flexFlow`. */
  webkitFlexFlow: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `flexGrow`. */
  webkitFlexGrow: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `flexShrink`. */
  webkitFlexShrink: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `flexWrap`. */
  webkitFlexWrap: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `justifyContent`. */
  webkitJustifyContent: CSSNotImplemented;
  webkitLineClamp: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `mask`. */
  webkitMask: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskBorder`. */
  webkitMaskBoxImage: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskBorderOutset`. */
  webkitMaskBoxImageOutset: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskBorderRepeat`. */
  webkitMaskBoxImageRepeat: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskBorderSlice`. */
  webkitMaskBoxImageSlice: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskBorderSource`. */
  webkitMaskBoxImageSource: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskBorderWidth`. */
  webkitMaskBoxImageWidth: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskClip`. */
  webkitMaskClip: CSSNotImplemented;
  webkitMaskComposite: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskImage`. */
  webkitMaskImage: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskOrigin`. */
  webkitMaskOrigin: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskPosition`. */
  webkitMaskPosition: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskRepeat`. */
  webkitMaskRepeat: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `maskSize`. */
  webkitMaskSize: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `order`. */
  webkitOrder: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `perspective`. */
  webkitPerspective: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `perspectiveOrigin`. */
  webkitPerspectiveOrigin: CSSNotImplemented;
  webkitTextFillColor: CSSNotImplemented;
  webkitTextStroke: CSSNotImplemented;
  webkitTextStrokeColor: CSSNotImplemented;
  webkitTextStrokeWidth: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `transform`. */
  webkitTransform: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `transformOrigin`. */
  webkitTransformOrigin: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `transformStyle`. */
  webkitTransformStyle: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `transition`. */
  webkitTransition: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `transitionDelay`. */
  webkitTransitionDelay: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `transitionDuration`. */
  webkitTransitionDuration: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `transitionProperty`. */
  webkitTransitionProperty: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `transitionTimingFunction`. */
  webkitTransitionTimingFunction: CSSNotImplemented;
  /** @deprecated This is a legacy alias of `userSelect`. */
  webkitUserSelect: CSSNotImplemented;
  whiteSpace: CSSNotImplemented;
  widows: CSSNotImplemented;
  width: CSSNotImplemented;
  willChange: CSSNotImplemented;
  wordBreak: CSSNotImplemented;
  wordSpacing: CSSNotImplemented;
  /** @deprecated */
  wordWrap: CSSNotImplemented;
  writingMode: CSSNotImplemented;
  zIndex: CSSNotImplemented;
}

export type CSSdefault = {
  [P in keyof CSSKeyValue]: CSSKeyValue[P] | CSSGlobal;
};
