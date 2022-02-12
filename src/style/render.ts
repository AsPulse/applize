import { ApplizeCSS, Border, Cardinal, Color, Length, Quattuor, XY } from '.';
import { BetterObjectConstructor } from '../util/betterObjectConstructor';

declare const Object: BetterObjectConstructor;

export function renderCSS(element: HTMLElement, style: Partial<ApplizeCSS>) {
  Object.entries(style).forEach(([key, value]) => {
    if ( typeof value === 'string' ) {
      element.style[key] = value;
    } else {
      if (value instanceof Color) {
        element.style[key] = value.toRGB();
      } else if (value instanceof XY) {
        if (key === 'overflow') {
          if(value.xValue) element.style.overflowX = value.xValue;
          if(value.yValue) element.style.overflowY = value.yValue;
        }
      } else if (value instanceof Cardinal) {
        if (key === 'border') {
          const valueBorder = value as Cardinal<Border>;
          if(valueBorder.topValue?.color) element.style.borderTopColor = valueBorder.topValue.color.toRGB();
          if(valueBorder.bottomValue?.color) element.style.borderTopColor = valueBorder.bottomValue.color.toRGB();
          if(valueBorder.leftValue?.color) element.style.borderTopColor = valueBorder.leftValue.color.toRGB();
          if(valueBorder.rightValue?.color) element.style.borderTopColor = valueBorder.rightValue.color.toRGB();

          if(valueBorder.topValue?.width) element.style.borderTopColor = valueBorder.topValue.width;
          if(valueBorder.bottomValue?.width) element.style.borderTopColor = valueBorder.bottomValue.width;
          if(valueBorder.leftValue?.width) element.style.borderTopColor = valueBorder.leftValue.width;
          if(valueBorder.rightValue?.width) element.style.borderTopColor = valueBorder.rightValue.width;

          if(valueBorder.topValue?.style) element.style.borderTopColor = valueBorder.topValue.style;
          if(valueBorder.bottomValue?.style) element.style.borderTopColor = valueBorder.bottomValue.style;
          if(valueBorder.leftValue?.style) element.style.borderTopColor = valueBorder.leftValue.style;
          if(valueBorder.rightValue?.style) element.style.borderTopColor = valueBorder.rightValue.style;
        } else if (key === 'margin' || key === 'padding') {
          const valueLength = value as Cardinal<Length>;
          if(valueLength.topValue) element.style[`${key}Top`] = valueLength.topValue;
          if(valueLength.leftValue) element.style[`${key}Left`] = valueLength.leftValue;
          if(valueLength.rightValue) element.style[`${key}Right`] = valueLength.rightValue;
          if(valueLength.bottomValue) element.style[`${key}Bottom`] = valueLength.bottomValue;
        }
      } else if (value instanceof Quattuor) {
        if ( key === 'borderRadius' ) {
          if(value.topLeftValue) element.style.borderTopLeftRadius = value.topLeftValue;
          if(value.topRightValue) element.style.borderTopRightRadius = value.topRightValue;
          if(value.bottomLeftValue) element.style.borderBottomLeftRadius = value.bottomLeftValue;
          if(value.bottomRightValue) element.style.borderBottomRightRadius = value.bottomRightValue;
        }
      }
    }
  });
}
