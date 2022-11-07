import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const {width} = Dimensions.get('window');
export default function Feedback({visible, onCloseFeedback, onSubmitFeedback}) {
  const [textInput, settextInput] = useState(null);
  useEffect(() => {
    settextInput(null);
  }, [visible]);
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'column',
            marginHorizontal: 20,
            borderRadius: 8,
            padding: 20,
          }}>
          <Text style={{fontSize: 20}}>Feedback</Text>
          <TextInput
            value={textInput}
            style={styles.input}
            multiline={true}
            numberOfLines={3}
            onChangeText={(text) => settextInput(text)}
            placeholder="Give your feedback"
          />
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity
              onPress={onCloseFeedback}
              style={[styles.button, {marginRight: 10}]}>
              <Text style={{color: 'white', textAlign: 'center'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSubmitFeedback(textInput)}
              style={[styles.button, {marginLeft: 10}]}>
              <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    textAlignVertical: 'top',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'green',
  },
});
