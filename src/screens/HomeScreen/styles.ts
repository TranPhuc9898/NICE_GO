import {Dimensions, StyleSheet} from 'react-native';
import {spacing} from '../../constants';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  redBox: {
    marginVertical: 50,
    marginHorizontal: 15,
    paddingVertical: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: '#fff',
  },
  redBox2: {
    marginVertical: 20,
    marginHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: '#fff',
  },
  mapContainer: {
    height: 200,
  },
  containerButton: {
    position: 'absolute',
    right: 25,
    bottom: 100,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: spacing.SPACING_50,
    height: spacing.SPACING_50,
    borderRadius: spacing.SPACING_50,
    backgroundColor: '#1154FF',
  },
  icon: {},
  text: {
    color: 'white',
  },
  loadingContainer: {
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
  overlay: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    elevation: 5,
  },
});
