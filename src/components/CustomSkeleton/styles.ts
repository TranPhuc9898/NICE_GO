// styles.ts
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginTop: 2,
    paddingHorizontal: 15,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 999,
  },
  itemCard: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  contentWrapper: {
    flex: 1,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  carTypeWrapper: {
    flexDirection: 'row',
    flexShrink: 0,
  },
  carTypeImage: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  priceText: {
    fontWeight: 'bold',
  },
  tripTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  marginTop5: {
    marginTop: 5,
  },
  flex1: {
    flex: 1,
  },
  marginRight10: {
    marginRight: 10,
  },
});
