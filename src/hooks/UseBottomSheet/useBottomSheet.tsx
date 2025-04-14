import {useRef, useCallback} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

export const useBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  return {
    bottomSheetRef,
    openBottomSheet,
    closeBottomSheet,
  };
};
