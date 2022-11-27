import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, {useRef, useState, useEffect} from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from '../Loader';

export default function ArrivalService({navigation}) {
  const currentPicker = useRef(0);
  const [mode, setMode] = useState('time');
  const [loading, setloading] = useState(false);
  const [arrival, setArrival] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    {value: null, file: []},
    null,
    null,
    null,
    null,
    null,
    {checked: false},
    {checked: false},
    null,
    null,
    {value: null, file: []},
    {value: null, file: []},
    null,
    null,
    {checked: false},
    null,
    null,
    {checked: false},
    null,
    null,
    {checked: false},
    null,
    null,
    {checked: false},
    null,
    null,
    null,
    {value: null, file: []},
    'For remarks; if the fuel truck needs to come around a second time, they can put the details of the second time it comes around into the remarks here',
    {checked: false},
    null,
    null,
    {value: null, file: []},
    'Broken Equipment, etc.',
    {checked: false},
    null,
    {checked: false},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    {value: null, file: []},
    null,
    null,
    null,
  ]);
  useEffect(() => {}, []);
  const setArrivalcheck = index => {
    var tarrival = [...arrival];
    tarrival[index].checked = !tarrival[index].checked;
    setArrival(tarrival);
    // console.log('triggered', tcheckList);
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = (type, index) => {
    currentPicker.current = index;
    setMode(type);
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    console.log('A date has been picked: ', date);
    var tarrival = [...arrival];
    tarrival[currentPicker.current] = tConvert(
      new Date(date).toLocaleTimeString(),
    );
    console.log(
      'A date has been picked: ',
      new Date(date).toLocaleTimeString(),
    );
    setArrival(tarrival);
    hideDatePicker();
  };
  const tConvert = time => {
    time = time.split(':');
    return time[0] + ':' + time[1] + ' ' + time[2].split(' ')[1];
  };
  const setNow = index => {
    var tarrival = [...arrival];
    tarrival[index] = tConvert(new Date().toLocaleTimeString());
    setArrival(tarrival);
  };
  const onPressDocPreA = async index => {
    try {
      setloading(true);
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      // console.log(res);
      RNFetchBlob.fs
        .readFile(res.uri, 'base64')
        .then(encoded => {
          // console.log(encoded, 'reports.base64');
          setloading(false);
          var tarrival = [...arrival];
          tarrival[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setArrival(tarrival);
        })
        .catch(error => {
          setloading(false);
          console.log(error);
        });

      // }
    } catch (err) {
      setloading(false);
      console.log(JSON.stringify(err), 'Errorss');
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        // throw err;
      }
    }
  };
  const removeFilePreA = (arrayIndex, index) => {
    var tarrival = [...arrival];
    tarrival[arrayIndex].file.splice(index, 1);
    setArrival(tarrival);
  };
  return (
    <ScrollView>
      <Loader visible={loading} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
        <TouchableOpacity
          style={{marginLeft: 10}}
          onPress={() => {
            navigation.openDrawer();
          }}>
          <Icons name="menu" color="green" size={30} />
        </TouchableOpacity>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>
          Arrival Services
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <View style={{padding: 20}}>
        <Text style={styleSheet.label}>Movement (AC Landed)</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styleSheet.picker}
            onPress={() => showDatePicker('time', 0)}>
            <Text style={{fontSize: 20, color: 'black'}}>
              {arrival[0] ? arrival[0] : '-- : --'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNow(0)} style={{padding: 10}}>
            <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
          </TouchableOpacity>
        </View>
        <Text style={styleSheet.label}>Movement (Chocks in)</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styleSheet.picker}
            onPress={() => showDatePicker('time', 1)}>
            <Text style={{fontSize: 20, color: 'black'}}>
              {arrival[1] ? arrival[1] : '-- : --'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNow(1)} style={{padding: 10}}>
            <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
          </TouchableOpacity>
        </View>
        <Text style={styleSheet.label}>Ground Power Unit (GPU):</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Start Time </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 2)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[2] ? arrival[2] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(2)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Stop Time </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 3)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[3] ? arrival[3] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(3)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styleSheet.label}>Number of Pax</Text>
        <TextInput
          style={styleSheet.input}
          value={arrival[4]}
          onChangeText={text => {
            var tarrival = [...arrival];
            tarrival[4] = text;
            setArrival(tarrival);
          }}
        />
        <Text style={styleSheet.label}>Number of Crew</Text>
        <TextInput
          style={styleSheet.input}
          value={arrival[5]}
          onChangeText={text => {
            var tarrival = [...arrival];
            tarrival[5] = text;
            setArrival(tarrival);
          }}
        />
        <Text style={styleSheet.label}>Baggage:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Number of Baggage Offloaded</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={arrival[6].value}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[6].value = text;
                setArrival(tarrival);
              }}
            />
            <TouchableOpacity
              onPress={event => onPressDocPreA(6)}
              style={{
                marginLeft: 10,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 8,
              }}>
              <Text style={{color: 'green'}}>Add photo</Text>
            </TouchableOpacity>
          </View>
          {arrival[6].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {arrival[6].file.map((value, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                      marginHorizontal: 5,
                      ...Platform.select({
                        ios: {
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.8,
                          shadowRadius: 2,
                        },
                        android: {
                          elevation: 3,
                        },
                      }),
                    }}>
                    <Text style={{color: 'black'}}>{value.name}</Text>
                    <TouchableOpacity onPress={() => removeFilePreA(6, index)}>
                      <Icons
                        style={{color: 'green', marginLeft: 10}}
                        name="close"
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>
        {/* ---------------------------Pax Movement-----------------------*/}
        <Text style={styleSheet.label}>Pax Movement :</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Pax Departed from Aircraft </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 7)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[7] ? arrival[7] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(7)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Pax Arrived at Terminal</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 8)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[8] ? arrival[8] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(8)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Pax Visa on Arrival</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 9)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[9] ? arrival[9] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(9)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Pax Completed CIQ</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 10)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[10] ? arrival[10] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(10)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Pax Departed from Terminal</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 11)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[11] ? arrival[11] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(11)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={event => setArrivalcheck(12)}>
              <Icons
                name={
                  arrival[12].checked
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                color={arrival[12].checked ? 'green' : 'black'}
                size={40}
              />
            </TouchableOpacity>
            <Text style={styleSheet.label}>VOA Not Required</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TouchableOpacity onPress={event => setArrivalcheck(13)}>
              <Icons
                name={
                  arrival[13].checked
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                color={arrival[13].checked ? 'green' : 'black'}
                size={40}
              />
            </TouchableOpacity>
            <Text style={styleSheet.label}>Pax Notified on Meeting Point</Text>
          </View>
          <Text style={styleSheet.label}>Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[14]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[14] = text;
                setArrival(tarrival);
              }}
            />
          </View>
        </View>

        {/* ---------------------------Catering-----------------------*/}

        <Text style={styleSheet.label}>Catering:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Catering Equipment Offloaded</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[15]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[15] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text style={styleSheet.label}>
              Catering Equipment List / Photo
            </Text>
            <TouchableOpacity>
              <TouchableOpacity
                onPress={event => onPressDocPreA(16)}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          {arrival[16].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {arrival[16].file.map((value, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                      marginHorizontal: 5,
                      ...Platform.select({
                        ios: {
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.8,
                          shadowRadius: 2,
                        },
                        android: {
                          elevation: 3,
                        },
                      }),
                    }}>
                    <Text style={{color: 'black'}}>{value.name}</Text>
                    <TouchableOpacity onPress={() => removeFilePreA(16, index)}>
                      <Icons
                        style={{color: 'green', marginLeft: 10}}
                        name="close"
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text style={styleSheet.label}>Next Catering Order</Text>
            <TouchableOpacity>
              <TouchableOpacity
                onPress={event => onPressDocPreA(17)}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          {arrival[17].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {arrival[17].file.map((value, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                      marginHorizontal: 5,
                      ...Platform.select({
                        ios: {
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.8,
                          shadowRadius: 2,
                        },
                        android: {
                          elevation: 3,
                        },
                      }),
                    }}>
                    <Text style={{color: 'black'}}>{value.name}</Text>
                    <TouchableOpacity onPress={() => removeFilePreA(17, index)}>
                      <Icons
                        style={{color: 'green', marginLeft: 10}}
                        name="close"
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          <Text style={styleSheet.label}>Catering Delivey Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 18)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[18] ? arrival[18] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(18)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[19]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[19] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={event => setArrivalcheck(20)}>
              <Icons
                name={
                  arrival[20].checked
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                color={arrival[20].checked ? 'green' : 'black'}
                size={40}
              />
            </TouchableOpacity>
            <Text style={styleSheet.label}>Not Required</Text>
          </View>
        </View>
        <Text style={styleSheet.label}>Water Service:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Completion Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 21)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[21] ? arrival[21] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(21)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[22]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[22] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={event => setArrivalcheck(23)}>
              <Icons
                name={
                  arrival[23].checked
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                color={arrival[23].checked ? 'green' : 'black'}
                size={40}
              />
            </TouchableOpacity>
            <Text style={styleSheet.label}>Not Required</Text>
          </View>
        </View>
        <Text style={styleSheet.label}>Lavatory Service:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Completion Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 24)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[24] ? arrival[24] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(24)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[25]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[25] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={event => setArrivalcheck(26)}>
              <Icons
                name={
                  arrival[26].checked
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                color={arrival[26].checked ? 'green' : 'black'}
                size={40}
              />
            </TouchableOpacity>
            <Text style={styleSheet.label}>Not Required</Text>
          </View>
        </View>
        <Text style={styleSheet.label}>Rubbish Service:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Completion Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 27)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[27] ? arrival[27] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(27)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[28]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[28] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={event => setArrivalcheck(29)}>
              <Icons
                name={
                  arrival[29].checked
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                color={arrival[29].checked ? 'green' : 'black'}
                size={40}
              />
            </TouchableOpacity>
            <Text style={styleSheet.label}>Not Required</Text>
          </View>
        </View>
        {/* ---------------------------Fuel on Arriva -----------------------*/}

        <Text style={styleSheet.label}>Fuel on Arrival:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Fuel Truck Arrival Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 30)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[30] ? arrival[30] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(30)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Start Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 31)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[31] ? arrival[31] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(31)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>End Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 32)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[32] ? arrival[32] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(32)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text style={styleSheet.label}>Fuel Receipt (signed)</Text>
            <TouchableOpacity>
              <TouchableOpacity
                onPress={event => onPressDocPreA(33)}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          {arrival[33].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {arrival[33].file.map((value, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                      marginHorizontal: 5,
                      ...Platform.select({
                        ios: {
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.8,
                          shadowRadius: 2,
                        },
                        android: {
                          elevation: 3,
                        },
                      }),
                    }}>
                    <Text style={{color: 'black'}}>{value.name}</Text>
                    <TouchableOpacity onPress={() => removeFilePreA(33, index)}>
                      <Icons
                        style={{color: 'green', marginLeft: 10}}
                        name="close"
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          <Text style={styleSheet.label}>Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[34]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[34] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={event => setArrivalcheck(35)}>
              <Icons
                name={
                  arrival[35].checked
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                color={arrival[35].checked ? 'green' : 'black'}
                size={40}
              />
            </TouchableOpacity>
            <Text style={styleSheet.label}>Not Required</Text>
          </View>
        </View>
        {/* ---------------------------Towing Service -----------------------*/}
        <Text style={styleSheet.label}>Towing Service:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Start Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 36)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[36] ? arrival[36] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(36)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>End Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 37)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[37] ? arrival[37] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(37)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text style={styleSheet.label}>Photo (if required)</Text>
            <TouchableOpacity
              onPress={event => onPressDocPreA(38)}
              style={{
                marginLeft: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 8,
              }}>
              <Text style={{color: 'green'}}>Upload</Text>
            </TouchableOpacity>
          </View>
          {arrival[38].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {arrival[38].file.map((value, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                      marginHorizontal: 5,
                      ...Platform.select({
                        ios: {
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.8,
                          shadowRadius: 2,
                        },
                        android: {
                          elevation: 3,
                        },
                      }),
                    }}>
                    <Text style={{color: 'black'}}>{value.name}</Text>
                    <TouchableOpacity onPress={() => removeFilePreA(38, index)}>
                      <Icons
                        style={{color: 'green', marginLeft: 10}}
                        name="close"
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          <Text style={styleSheet.label}>Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[39]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[39] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={event => setArrivalcheck(40)}>
              <Icons
                name={
                  arrival[40].checked
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                color={arrival[40].checked ? 'green' : 'black'}
                size={40}
              />
            </TouchableOpacity>
            <Text style={styleSheet.label}>Not Required</Text>
          </View>
        </View>

        {/* ---------------------------Overnight Bay-----------------------*/}
        <Text style={styleSheet.label}>Overnight Bay:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Number</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={arrival[41]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[41] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={event => setArrivalcheck(42)}>
              <Icons
                name={
                  arrival[42].checked
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                color={arrival[42].checked ? 'green' : 'black'}
                size={40}
              />
            </TouchableOpacity>
            <Text style={styleSheet.label}>Not Required</Text>
          </View>
        </View>

        {/* ---------------------------Crew Movement	-----------------------*/}

        <Text style={styleSheet.label}>Crew Movement:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Crew Departed from Aircraft</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 43)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[43] ? arrival[43] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(43)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Crew Arrived at Terminal</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 44)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[44] ? arrival[44] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(44)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Crew Visa on Arrival</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 45)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[45] ? arrival[45] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(45)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Crew Completed CIQ</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 46)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[46] ? arrival[46] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(46)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Crew Departed from Terminal</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 47)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[47] ? arrival[47] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(47)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Transport Arrival Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 48)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[48] ? arrival[48] : '-- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(48)} style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Driver Contact Number</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={arrival[49]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[49] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <Text style={styleSheet.label}>Hotel Name</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={arrival[50]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[50] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <Text style={styleSheet.label}>Hotel Location</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={arrival[51]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[51] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text style={styleSheet.label}>Map of Route to Hotel</Text>
            <TouchableOpacity
              onPress={event => onPressDocPreA(52)}
              style={{
                marginLeft: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 8,
              }}>
              <Text style={{color: 'green'}}>Upload</Text>
            </TouchableOpacity>
          </View>
          {arrival[52].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {arrival[52].file.map((value, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                      marginHorizontal: 5,
                      ...Platform.select({
                        ios: {
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.8,
                          shadowRadius: 2,
                        },
                        android: {
                          elevation: 3,
                        },
                      }),
                    }}>
                    <Text style={{color: 'black'}}>{value.name}</Text>
                    <TouchableOpacity onPress={() => removeFilePreA(52, index)}>
                      <Icons
                        style={{color: 'green', marginLeft: 10}}
                        name="close"
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <Text style={styleSheet.label}>Travel Time (Approximate)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={arrival[53]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[53] = text;
                setArrival(tarrival);
              }}
            />
          </View>
          <Text style={styleSheet.label}>Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[54]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[54] = text;
                setArrival(tarrival);
              }}
            />
          </View>
        </View>
        <Text style={styleSheet.label}>Additional Remarks</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styleSheet.input}
            multiline={true}
            numberOfLines={2}
            value={arrival[55]}
            onChangeText={text => {
              var tarrival = [...arrival];
              tarrival[55] = text;
              setArrival(tarrival);
            }}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={[styleSheet.button, {marginRight: 10}]}>
            <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styleSheet.button, {marginLeft: 10}]}>
            <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        is24Hour={true}
      />
    </ScrollView>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  checkbox: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
  },
  label: {
    fontSize: 15,
    color: 'black',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'green',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },

  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 12,
    marginVertical: 20,
    paddingHorizontal: 20,
    color: 'black',
  },

  item: {
    padding: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    textAlignVertical: 'top',
    color: 'black',
    backgroundColor: 'white',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  remarks: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    flex: 1,
    color: 'black',
  },
});
