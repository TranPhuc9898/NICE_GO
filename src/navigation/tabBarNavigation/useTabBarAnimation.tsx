import {setTabBarTranslateY} from '@/redux/slice/tabBar-slice';
import {useDispatch} from 'react-redux';
import {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';

const useTabBarAnimation = () => {
  const dispatch = useDispatch();

  // Tạo một sharedValue để thao tác trên UI thread.
  const translateY = useSharedValue(0);

  // Hàm để dispatch sang redux (nếu muốn bottomTab cũng trượt).
  const dispatchSetTabBarTranslateY = (ty: number) => {
    dispatch(setTabBarTranslateY(ty));
  };

  // Lắng nghe sự kiện scroll
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      // Khi scroll > 1px thì cho translate = 100, ngược lại = 0
      const ty = event.contentOffset.y > 1 ? 150 : 0;

      // Gán vào biến UI
      translateY.value = ty;

      // Nếu vẫn muốn bottomTab trượt xuống, ta dispatch để bottomTab cũng translate
      runOnJS(dispatchSetTabBarTranslateY)(ty);
    },
  });

  return {
    scrollHandler,
    translateY, // share để component khác tái sử dụng
  };
};

export default useTabBarAnimation;
