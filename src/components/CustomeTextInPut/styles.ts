import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  countryCodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  flagContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'red', // Màu đỏ lá cờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  countryCode: {
    marginLeft: 4,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    // width: 1,
    // height: '60%', // Chiều cao vạch thẳng
    // backgroundColor: '#EAEAEA', // Màu vạch
    // marginHorizontal: 8, // Khoảng cách giữa vạch và các thành phần xung quanh
    width: '100%',
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: 48,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 8,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  // Thêm 2 style cho nút X (bên trái)
  clearIconContainer: {
    paddingHorizontal: 8,
    // Bạn có thể tùy chỉnh margin, padding, v.v. cho đẹp
  },
  clearIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999', // Màu "X"
  },
});

export default styles;
