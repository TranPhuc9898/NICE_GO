// src/components/Icon.tsx (CustomIcon)
import React, {useState, useEffect} from 'react';
import FastImage, {FastImageProps, Source} from 'react-native-fast-image';
import {StyleProp, ImageStyle} from 'react-native';

export interface ICustomImage extends FastImageProps {}

/**
 * CustomIcon Component
 * Hiển thị hình ảnh sử dụng FastImage với màu sắc tùy chỉnh thông qua style.
 */
const CustomIcon: React.FC<ICustomImage> = ({
  source,
  style,
  resizeMode = FastImage.resizeMode.contain,
  ...props
}) => {
  const [currentSource, setCurrentSource] = useState<any>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    console.log('Failed to load image:', source); // Debug
    setHasError(true);
  };

  useEffect(() => {
    console.log('Source prop:', source); // Debug
    if (!source) {
      setCurrentSource(null);
      setHasError(false);
      return;
    }

    if (typeof source === 'number') {
      setCurrentSource(source);
      setHasError(false);
    } else if (typeof source === 'object' && source.uri) {
      const uri = source.uri;
      if (
        uri.startsWith('http://') ||
        uri.startsWith('https://') ||
        uri.startsWith('file://')
      ) {
        setCurrentSource(source);
        setHasError(false);
      } else {
        setCurrentSource(null);
        setHasError(false);
      }
    } else {
      setCurrentSource(null);
      setHasError(false);
    }
  }, [source]);

  if (hasError || !currentSource) {
    return null;
  }

  return (
    <FastImage
      style={style ? style : {width: 24, height: 24}}
      resizeMode={resizeMode}
      {...props}
      source={currentSource}
      onError={handleError}
      // Không truyền tintColor như một prop riêng biệt
    />
  );
};

export default CustomIcon;
