import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useRef} from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Feedback from '../Feedback';
import Loader from '../Loader';

export default function PreDepartureChecklist({navigation}) {
  const [vFeedback, setvFeedback] = useState(false);
  const currentFeedback = useRef(0);
  const [loading, setloading] = useState(false);

  const [mode, setMode] = useState('time');
  const currentDeparture = useRef(0);
  const [pdeparturecheck, setpdeparturecheck] = useState([
    null,
    {value: null, file: []},
    null,
    null,
    null,
    {checked: false, remarks: null},
    {value: null, file: []},
    null,
    null,
    null,
    null,
    null,
    null,
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    null,
    null,
    null,
    null,
    null,
  ]);
  const getFeedback = index => {
    setvFeedback(true);
    currentFeedback.current = index;
  };
  const onSubmitFeedback = text => {
    var index = currentFeedback.current;
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].remarks = text;
    setpdeparturecheck(tpdeparturecheck);
    console.log(tpdeparturecheck);
    setvFeedback(false);
  };
  const removeFeedback = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].remarks = null;
    setpdeparturecheck(tpdeparturecheck);
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
          var tpdeparturecheck = [...pdeparturecheck];
          tpdeparturecheck[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setpdeparturecheck(tpdeparturecheck);
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
  const [isDatePickerVisibleDeparture, setDatePickerVisibilityDeparture] =
    useState(false);
  const showDatePickerDeparture = (type, index) => {
    currentDeparture.current = index;
    setMode(type);
    setDatePickerVisibilityDeparture(true);
  };

  const hideDatePickerDeparture = () => {
    setDatePickerVisibilityDeparture(false);
  };
  const tConvert = time => {
    time = time.split(':');
    return time[0] + ':' + time[1] + ' ' + time[2].split(' ')[1];
  };

  const handleConfirmDeparture = date => {
    // console.log("A date has been picked: ",date);
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[currentDeparture.current] =
      new Date(date).toLocaleDateString() +
      ',' +
      tConvert(new Date(date).toLocaleTimeString());
    setpdeparturecheck(tpdeparturecheck);
    hideDatePickerDeparture();
  };
  const setNowDeparture = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index] =
      new Date().toLocaleDateString() +
      ',' +
      tConvert(new Date().toLocaleTimeString());
    setpdeparturecheck(tpdeparturecheck);
  };
  const setCheckedDeparture = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].checked = !tpdeparturecheck[index].checked;
    setpdeparturecheck(tpdeparturecheck);
    // console.log('triggered', tcheckList);
  };
  const removeFilePreA = (arrayIndex, index) => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[arrayIndex].file.splice(index, 1);
    setpdeparturecheck(tpdeparturecheck);
  };

  return (
    <ScrollView>
      <Feedback
        visible={vFeedback}
        onCloseFeedback={() => setvFeedback(false)}
        onSubmitFeedback={onSubmitFeedback}
      />
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
          Pre-Departure Checklist
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <View style={{padding: 20}}>
        <Text style={styleSheet.label}>Crew Meeting Location</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styleSheet.input}
            value={pdeparturecheck[0]}
            onChangeText={text => {
              var tpdeparturecheck = [...pdeparturecheck];
              tpdeparturecheck[0] = text;
              setpdeparturecheck(tpdeparturecheck);
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
          <Text style={styleSheet.label}>Photo of Meeting Location</Text>
          <TouchableOpacity
            onPress={event => onPressDocPreA(1)}
            style={{
              marginLeft: 10,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderRadius: 8,
            }}>
            <Text style={{color: 'green'}}>Take Camera</Text>
          </TouchableOpacity>
        </View>
        {pdeparturecheck[1].file.length > 0 && (
          <View style={{marginBottom: 20}}>
            {pdeparturecheck[1].file.map((value, index) => {
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
                  <TouchableOpacity onPress={() => removeFilePreA(1, index)}>
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
        <Text style={styleSheet.label}>Crew Transport Pickup Time</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styleSheet.picker}
            onPress={() => showDatePickerDeparture('datetime', 2)}>
            <Text style={{fontSize: 20, color: 'black'}}>
              {pdeparturecheck[2] ? pdeparturecheck[2] : 'dd/mm/yy, -- : --'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNowDeparture(2)}
            style={{padding: 10}}>
            <Text style={{fontSize: 20, color: 'green'}}>Today</Text>
          </TouchableOpacity>
        </View>
        <Text style={styleSheet.label}>Confirm Catering Delivery Time</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styleSheet.picker}
            onPress={() => showDatePickerDeparture('datetime', 3)}>
            <Text style={{fontSize: 20, color: 'black'}}>
              {pdeparturecheck[3] ? pdeparturecheck[3] : 'dd/mm/yy, -- : --'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNowDeparture(3)}
            style={{padding: 10}}>
            <Text style={{fontSize: 20, color: 'green'}}>Today</Text>
          </TouchableOpacity>
        </View>
        <Text style={styleSheet.label}>Fuelling Time</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styleSheet.picker}
            onPress={() => showDatePickerDeparture('datetime', 4)}>
            <Text style={{fontSize: 20, color: 'black'}}>
              {pdeparturecheck[4] ? pdeparturecheck[4] : 'dd/mm/yy, -- : --'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNowDeparture(4)}
            style={{padding: 10}}>
            <Text style={{fontSize: 20, color: 'green'}}>Today</Text>
          </TouchableOpacity>
        </View>
        <View style={styleSheet.toggleContainer}>
          <TouchableOpacity
            onPress={event => setCheckedDeparture(5)}
            style={[
              styleSheet.toggleButton,
              {
                backgroundColor: pdeparturecheck[5].checked ? 'green' : 'white',
              },
            ]}>
            <Text
              style={[
                styleSheet.label,
                {
                  textAlign: 'center',
                  color: pdeparturecheck[5].checked ? 'white' : 'black',
                },
              ]}>
              Prepared Departure GenDec
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getFeedback(5)}>
            <Icons
              style={{marginLeft: 10}}
              name="comment-processing-outline"
              color="green"
              size={30}
            />
          </TouchableOpacity>
        </View>
        {pdeparturecheck[5].remarks && (
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <View style={styleSheet.remarks}>
              <Text>{pdeparturecheck[5].remarks}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFeedback(5)}>
              <Icons
                style={{marginLeft: 10}}
                name="delete-circle-outline"
                color="red"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 20,
          }}>
          <Text style={styleSheet.label}>Upload Departure GenDec</Text>
          <TouchableOpacity
            onPress={event => onPressDocPreA(6)}
            style={{
              marginLeft: 10,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderRadius: 8,
            }}>
            <Text style={{color: 'green'}}>Add Files</Text>
          </TouchableOpacity>
        </View>
        {pdeparturecheck[6].file.length > 0 && (
          <View style={{marginBottom: 20}}>
            {pdeparturecheck[6].file.map((value, index) => {
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
        {/*   ------------------------------Flight Documents/Admin ----------- */}
        <Text style={styleSheet.label}>Flight Documents / Admin:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Flight Documents Received</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('time', 7)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[7] ? pdeparturecheck[7] : 'dd/mm/yy,--:--'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(7)}
              style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Flight Documents Printed </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('time', 8)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[8] ? pdeparturecheck[8] : 'dd/mm/yy,--:--'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(8)}
              style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Notams Updated </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('time', 9)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[9] ? pdeparturecheck[9] : 'dd/mm/yy,--:--'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(9)}
              style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Weather Information Updated </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('time', 10)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[10] ? pdeparturecheck[10] : 'dd/mm/yy,--:--'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(10)}
              style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>ATC Flight Plan Filed </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('time', 11)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[11] ? pdeparturecheck[11] : 'dd/mm/yy,--:--'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(11)}
              style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Slots Confirmed </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('time', 12)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[12] ? pdeparturecheck[12] : 'dd/mm/yy,--:--'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(12)}
              style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*   ------------------------------Flight Documents/Admin End ----------- */}

        <View style={styleSheet.toggleContainer}>
          <TouchableOpacity
            onPress={event => setCheckedDeparture(13)}
            style={[
              styleSheet.toggleButton,
              {
                backgroundColor: pdeparturecheck[13].checked
                  ? 'green'
                  : 'white',
              },
            ]}>
            <Text
              style={[
                styleSheet.label,
                {
                  textAlign: 'center',
                  color: pdeparturecheck[13].checked ? 'white' : 'black',
                },
              ]}>
              FBO Reminder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getFeedback(13)}>
            <Icons
              style={{marginLeft: 10}}
              name="comment-processing-outline"
              color="green"
              size={30}
            />
          </TouchableOpacity>
        </View>
        {pdeparturecheck[13].remarks && (
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <View style={styleSheet.remarks}>
              <Text>{pdeparturecheck[13].remarks}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFeedback(13)}>
              <Icons
                style={{marginLeft: 10}}
                name="delete-circle-outline"
                color="red"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styleSheet.toggleContainer}>
          <TouchableOpacity
            onPress={event => setCheckedDeparture(14)}
            style={[
              styleSheet.toggleButton,
              {
                backgroundColor: pdeparturecheck[14].checked
                  ? 'green'
                  : 'white',
              },
            ]}>
            <Text
              style={[
                styleSheet.label,
                {
                  textAlign: 'center',
                  color: pdeparturecheck[14].checked ? 'white' : 'black',
                },
              ]}>
              Handling Agent Reminder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getFeedback(14)}>
            <Icons
              style={{marginLeft: 10}}
              name="comment-processing-outline"
              color="green"
              size={30}
            />
          </TouchableOpacity>
        </View>
        {pdeparturecheck[14].remarks && (
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <View style={styleSheet.remarks}>
              <Text>{pdeparturecheck[14].remarks}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFeedback(14)}>
              <Icons
                style={{marginLeft: 10}}
                name="delete-circle-outline"
                color="red"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styleSheet.toggleContainer}>
          <TouchableOpacity
            onPress={event => setCheckedDeparture(15)}
            style={[
              styleSheet.toggleButton,
              {
                backgroundColor: pdeparturecheck[15].checked
                  ? 'green'
                  : 'white',
              },
            ]}>
            <Text
              style={[
                styleSheet.label,
                {
                  textAlign: 'center',
                  color: pdeparturecheck[15].checked ? 'white' : 'black',
                },
              ]}>
              CIQ Reminder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getFeedback(15)}>
            <Icons
              style={{marginLeft: 10}}
              name="comment-processing-outline"
              color="green"
              size={30}
            />
          </TouchableOpacity>
        </View>
        {pdeparturecheck[15].remarks && (
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <View style={styleSheet.remarks}>
              <Text>{pdeparturecheck[15].remarks}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFeedback(15)}>
              <Icons
                style={{marginLeft: 10}}
                name="delete-circle-outline"
                color="red"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styleSheet.toggleContainer}>
          <TouchableOpacity
            onPress={event => setCheckedDeparture(16)}
            style={[
              styleSheet.toggleButton,
              {
                backgroundColor: pdeparturecheck[16].checked
                  ? 'green'
                  : 'white',
              },
            ]}>
            <Text
              style={[
                styleSheet.label,
                {
                  textAlign: 'center',
                  color: pdeparturecheck[16].checked ? 'white' : 'black',
                },
              ]}>
              Airport Security Reminder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getFeedback(16)}>
            <Icons
              style={{marginLeft: 10}}
              name="comment-processing-outline"
              color="green"
              size={30}
            />
          </TouchableOpacity>
        </View>
        {pdeparturecheck[16].remarks && (
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <View style={styleSheet.remarks}>
              <Text>{pdeparturecheck[16].remarks}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFeedback(16)}>
              <Icons
                style={{marginLeft: 10}}
                name="delete-circle-outline"
                color="red"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styleSheet.toggleContainer}>
          <TouchableOpacity
            onPress={event => setCheckedDeparture(17)}
            style={[
              styleSheet.toggleButton,
              {
                backgroundColor: pdeparturecheck[17].checked
                  ? 'green'
                  : 'white',
              },
            ]}>
            <Text
              style={[
                styleSheet.label,
                {
                  textAlign: 'center',
                  color: pdeparturecheck[17].checked ? 'white' : 'black',
                },
              ]}>
              Catering Agent Reminder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getFeedback(17)}>
            <Icons
              style={{marginLeft: 10}}
              name="comment-processing-outline"
              color="green"
              size={30}
            />
          </TouchableOpacity>
        </View>
        {pdeparturecheck[17].remarks && (
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <View style={styleSheet.remarks}>
              <Text>{pdeparturecheck[17].remarks}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFeedback(17)}>
              <Icons
                style={{marginLeft: 10}}
                name="delete-circle-outline"
                color="red"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styleSheet.toggleContainer}>
          <TouchableOpacity
            onPress={event => setCheckedDeparture(18)}
            style={[
              styleSheet.toggleButton,
              {
                backgroundColor: pdeparturecheck[18].checked
                  ? 'green'
                  : 'white',
              },
            ]}>
            <Text
              style={[
                styleSheet.label,
                {
                  textAlign: 'center',
                  color: pdeparturecheck[18].checked ? 'white' : 'black',
                },
              ]}>
              Aircraft Fueller Reminder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getFeedback(18)}>
            <Icons
              style={{marginLeft: 10}}
              name="comment-processing-outline"
              color="green"
              size={30}
            />
          </TouchableOpacity>
        </View>
        {pdeparturecheck[18].remarks && (
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <View style={styleSheet.remarks}>
              <Text>{pdeparturecheck[18].remarks}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFeedback(18)}>
              <Icons
                style={{marginLeft: 10}}
                name="delete-circle-outline"
                color="red"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
        {/*   ------------------------------Transport Operator Reminder	 ----------- */}
        <Text style={[styleSheet.label, {marginTop: 10}]}>
          Transport Operator Reminder:
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Driver Name</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={pdeparturecheck[19]}
              onChangeText={text => {
                var tpdeparturecheck = [...pdeparturecheck];
                tpdeparturecheck[19] = text;
                setpdeparturecheck(tpdeparturecheck);
              }}
            />
          </View>
          <Text style={styleSheet.label}>Driver Contact Number</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={pdeparturecheck[20]}
              onChangeText={text => {
                var tpdeparturecheck = [...pdeparturecheck];
                tpdeparturecheck[20] = text;
                setpdeparturecheck(tpdeparturecheck);
              }}
            />
          </View>
          <Text style={styleSheet.label}>Fuelling Time</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('time', 21)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[21]
                  ? pdeparturecheck[21]
                  : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(21)}
              style={{padding: 10}}>
              <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={pdeparturecheck[22]}
              onChangeText={text => {
                var tpdeparturecheck = [...pdeparturecheck];
                tpdeparturecheck[22] = text;
                setpdeparturecheck(tpdeparturecheck);
              }}
            />
          </View>
        </View>
        {/*   ------------------------------Transport Operator Reminder	 End ----------- */}
        <Text style={styleSheet.label}>Additional Remarks</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styleSheet.input}
            multiline={true}
            numberOfLines={2}
            value={pdeparturecheck[23]}
            onChangeText={text => {
              var tpdeparturecheck = [...pdeparturecheck];
              tpdeparturecheck[23] = text;
              setpdeparturecheck(tpdeparturecheck);
            }}
          />
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisibleDeparture}
        mode={mode}
        onConfirm={handleConfirmDeparture}
        onCancel={hideDatePickerDeparture}
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
