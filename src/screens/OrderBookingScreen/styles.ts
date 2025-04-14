import {spacing} from '@/constants';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
  },
  iconText: {
    marginRight: 6,
    fontSize: 16,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  value: {
    color: '#333',
    flex: 1,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  infoBox2: {
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
  },
  infoBox: {
    backgroundColor: '#f6f6f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  infoValue: {
    fontWeight: '600',
    color: '#333',
  },
  fieldGroup: {
    marginTop: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 10,
    width: '100%',
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#000',
  },
  selectField: {
    marginBottom: 12,
  },
  selectLabel: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  selectBoxText: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1154FF',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1154FF',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: '#333',
    fontSize: 14,
  },
  bookingButton: {
    backgroundColor: '#1154FF',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // =========== Inner Sheet styles ============
  innerSheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  innerSheetItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  innerSheetItemText: {
    color: '#333',
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});
