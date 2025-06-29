import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import { useAppTheme } from '../utils/useAppTheme';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const Checkout = ({ route }) => {
  const { amount = 0 } = route.params;

  const { colors, isDarkMode, isConnected } = useAppTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [shippingAddress, setShippingAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const shippingCharge = 5;

  useEffect(() => {
    calculateFinalAmount();
  }, [amount, discountApplied]);

  const calculateFinalAmount = () => {
    let total = amount + shippingCharge;
    if (discountApplied) {
      total = total * 0.9; // Apply 10% discount
    }
    setFinalAmount(total);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'eshop10') {
      if (!discountApplied) {
        setDiscountApplied(true);
        ToastAndroid.show('Coupon applied: 10% discount', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Coupon already applied', ToastAndroid.SHORT);
      }
    } else {
      Alert.alert('Invalid Coupon', 'Please enter a valid coupon code.');
    }
  };

  const handlePlaceOrder = () => {
    if (!shippingAddress.trim()) {
      Alert.alert('Missing Info', 'Please enter a shipping address.');
      return;
    }

    dispatch({ type: 'CLEAR_CART' }); // clear cart from Redux
    ToastAndroid.show('Order Placed Successfully!', ToastAndroid.LONG);
    navigation.navigate('Home'); // navigate to Home screen
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>

      <Text style={[styles.label, { color: colors.text }]}>
        Shipping Address
      </Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.subText, color: colors.text },
        ]}
        placeholder="Enter your full address"
        placeholderTextColor={colors.subText}
        multiline
        numberOfLines={3}
        value={shippingAddress}
        onChangeText={setShippingAddress}
      />

      <Text style={[styles.label, { color: colors.text }]}>Coupon Code</Text>
      <View style={styles.couponRow}>
        <TextInput
          style={[
            styles.input,
            {
              flex: 1,
              borderColor: colors.subText,
              color: colors.text,
            },
          ]}
          placeholder="e.g. ESHOP10"
          placeholderTextColor={colors.subText}
          value={couponCode}
          onChangeText={setCouponCode}
        />
        <TouchableOpacity style={styles.couponBtn} onPress={handleApplyCoupon}>
          <Text style={styles.btnText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.summaryBox,
          { backgroundColor: isDarkMode ? '#ccc' : '#fff' },
        ]}
      >
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Items Total</Text>
          <Text style={styles.summaryText}>${amount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Shipping</Text>
          <Text style={styles.summaryText}>$5.00</Text>
        </View>
        {discountApplied && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Discount</Text>
            <Text style={styles.summaryText}>-10%</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>${finalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.checkoutBtn} onPress={handlePlaceOrder}>
        <Text style={styles.checkoutText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  couponBtn: {
    marginLeft: 10,
    backgroundColor: '#1e3c72',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  summaryBox: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryText: { fontSize: 15 },
  totalText: { fontSize: 17, fontWeight: 'bold' },
  checkoutBtn: {
    backgroundColor: '#1e3c72',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default Checkout;
