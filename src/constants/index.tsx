import _ from 'lodash';

export const SPACING_5 = 5;
export const SPACING_10 = 10;
export const SPACING_15 = 15;
export const SPACING_20 = 20;
export const SPACING_25 = 25;
export const SPACING_30 = 30;
export const SPACING_35 = 35;
export const SPACING_40 = 40;
export const SPACING_45 = 45;
export const SPACING_50 = 50;
export const SPACING_55 = 55;
export const SPACING_60 = 60;

interface ISpacing {
  SPACING_5: number;
  SPACING_10: number;
  SPACING_15: number;
  SPACING_20: number;
  SPACING_25: number;
  SPACING_30: number;
  SPACING_35: number;
  SPACING_40: number;
  SPACING_45: number;
  SPACING_50: number;
  SPACING_55: number;
  SPACING_60: number;
}

export const spacing: ISpacing = {
  SPACING_5: SPACING_5,
  SPACING_10: SPACING_10,
  SPACING_15: SPACING_15,
  SPACING_20: SPACING_20,
  SPACING_25: SPACING_25,
  SPACING_30: SPACING_30,
  SPACING_35: SPACING_35,
  SPACING_40: SPACING_40,
  SPACING_45: SPACING_45,
  SPACING_50: SPACING_50,
  SPACING_55: SPACING_55,
  SPACING_60: SPACING_60,
};

export const handleChangePrice = (text: any) => {
  if (_.isEmpty(text)) {
    const numberVal = parseInt(text, 10);
    const formatted = numberVal.toLocaleString('vi-VN');
    return formatted;
  }

  return ''; // Nếu text rỗng thì return rỗng
};

export const formatDuration = (durationString: any) => {
  const [strH, strM, strS] = durationString.split(':');
  const hours = parseInt(strH, 10);
  const minutes = parseInt(strM, 10);
  const seconds = parseInt(strS, 10);

  return `${hours} hours ${minutes} minutes ${seconds} seconds`;
};
