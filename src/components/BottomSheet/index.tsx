// // BottomSheetComponent.tsx
// import React, {forwardRef} from 'react';
// import {Text, StyleSheet} from 'react-native';
// import {
//   BottomSheetFooterProps,
//   BottomSheetModal,
//   BottomSheetView,
// } from '@gorhom/bottom-sheet';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';

// type BottomSheetComponentProps = {
//   content?: React.ReactNode;
//   footerComponent?: React.FC<BottomSheetFooterProps>;
// };

// const BottomSheetComponent = forwardRef<
//   BottomSheetModal,
//   BottomSheetComponentProps
// >(({content, footerComponent}, ref) => {
//   const {bottom: safeBottomArea} = useSafeAreaInsets();

//   return (
//     <BottomSheetModal
//       ref={ref}
//       bottomInset={safeBottomArea + 16}
//       enablePanDownToClose={true}
//       style={styles.sheetContainer}
//       backgroundComponent={null}
//       footerComponent={footerComponent}
//       detached={true}>
//       <BottomSheetView
//         style={styles.contentContainerStyle}
//         enableFooterMarginAdjustment={true}>
//         {content || <Text>Default Content</Text>}
//       </BottomSheetView>
//     </BottomSheetModal>
//   );
// });

// export default BottomSheetComponent;

// const styles = StyleSheet.create({
//   sheetContainer: {
//     marginHorizontal: 16,
//     backgroundColor: 'white',
//     borderRadius: 16,
//     shadowColor: 'rgba(0,0,0,0.25)',
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.95,
//     shadowRadius: 16.0,
//     elevation: 24,
//   },
//   contentContainerStyle: {
//     paddingTop: 12,
//     paddingBottom: 12,
//     paddingHorizontal: 12,
//   },
// });

// BottomSheetComponent.tsx
import React, {forwardRef} from 'react';
import {Text, StyleSheet, useWindowDimensions} from 'react-native';
import {
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type BottomSheetComponentProps = {
  content?: React.ReactNode;
  footerComponent?: React.FC<BottomSheetFooterProps>;
} & Partial<BottomSheetModalProps>;
// <-- Kế thừa các props của BottomSheetModal,
// ví dụ: snapPoints, enablePanDownToClose, v.v.

const BottomSheetComponent = forwardRef<
  BottomSheetModal,
  BottomSheetComponentProps
>((props, ref) => {
  const {
    content,
    footerComponent,
    snapPoints, // Mặc định
    enablePanDownToClose = true, // Mặc định
    ...restProps
  } = props;
  const {height} = useWindowDimensions();
  const {bottom: safeBottomArea} = useSafeAreaInsets();

  return (
    <BottomSheetModal
      ref={ref}
      bottomInset={safeBottomArea}
      style={[styles.sheetContainer, {maxHeight: height * 0.85}]}
      backgroundComponent={null}
      footerComponent={footerComponent}
      detached={true}
      // Gán props
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      {...restProps}>
      <BottomSheetView style={styles.contentContainerStyle}>
        {content || <Text>Default Content</Text>}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default BottomSheetComponent;

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.95,
    shadowRadius: 16.0,
    elevation: 24,
  },
  contentContainerStyle: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
});
