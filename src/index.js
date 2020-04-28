import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';

// Icon
import Feather from 'react-native-vector-icons/Feather';

class DropDownPicker extends React.Component {
  constructor(props) {
    super(props);

    let choice;

    if (props.defaultNull || (props.hasOwnProperty('defaultValue') && props.defaultValue === null)) {
      choice = this.null();
    } else if (props.defaultValue) {
      choice = props.items.find(item => item.value === props.defaultValue);
    } else if (props.items.filter(item => item.hasOwnProperty('selected') && item.selected === true).length > 0) {
      choice = props.items.filter(item => item.hasOwnProperty('selected') && item.selected === true)[0];
    } else if (props.items.length > 0) {
      choice = props.items[props.defaultIndex ?? 0];
    } else {
      choice = this.null();
    }

    this.state = {
      choice: {
        label: choice.label,
        value: choice.value
      },
      visible: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultNull === true) {
      return {
        choice: {
          label: null,
          value: null
        },
        visible: props.disabled ? false : state.visible,
      };
    }

    return null;
  }

  null() {
    return {
      label: null,
      value: null
    }
  }

  toggle() {
    this.setState({
      visible: !this.state.visible
    });
  }

  select(item, index) {
    this.setState({
      choice: {
        label: item.label,
        value: item.value
      },
      visible: false
    });

    this.props.defaultNull = false;

    // onChangeItem callback
    this.props.onChangeItem(item, index);
  }

  getLayout(layout) {
    this.setState({
      top: layout.height - 1
    });
  }

  render() {
    const { defaultNull, placeholder, disabled } = this.props;
    const label = (defaultNull) && this.state.choice.label === null ? (placeholder) : this.state.choice.label;
    const opacity = disabled ? 0.5 : 1;
    const androidHeight = (this.props.items.length >= 4) ? 240.0 : this.props.items.length * 40.0 + 70.0
    return (
      <View style={(Platform.OS == 'ios') ? this.props.containerStyle
        : (this.state.visible) ? { height: androidHeight } : this.props.containerStyle}>
        <TouchableOpacity onLayout={(event) => { this.getLayout(event.nativeEvent.layout) }} disabled={disabled} onPress={() => this.toggle()} activeOpacity={1}
          style={[this.props.style, { flexDirection: 'row' }, Platform.OS == 'ios' && { flex: 1 }, (Platform.OS == 'android' && !this.state.visible) ? { flex: 1 } : { height: 70.0 }]}>
          <View style={[styles.dropDownBase, styles.dropDownDisplay, this.state.visible && styles.noBottomLeftRadius]}>
            <Text style={[this.props.labelStyle, { opacity }]}>{label}</Text>
          </View>
          {this.props.showArrow && (
            <View style={[styles.dropDown, styles.arrow, this.state.visible && styles.noBottomRightRadius]}>
              <View style={[this.props.arrowStyle, { opacity }]}>
                {
                  !this.state.visible ? (
                    this.props.customArrowUp ?? this.props.iconDown
                  ) : (
                      this.props.customArrowDown ?? this.props.iconUp
                    )
                }
              </View>
            </View>
          )}
        </TouchableOpacity>
        <View style={[styles.dropDown, styles.dropDownBox, !this.state.visible && styles.hidden, {
          top: this.state.top,
          maxHeight: this.props.dropDownMaxHeight,
          zIndex: this.props.zIndex
        }]}>
          <ScrollView style={{ width: '100%' }} nestedScrollEnabled={true}>
            {
              this.props.items.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => this.select(item, index)} style={[styles.dropDownItem, this.props.itemStyle, (
                  this.state.choice.value === item.value && this.props.activeItemStyle
                )]}>
                  <Text style={[this.props.labelStyle,
                  this.state.choice.value === item.value && this.props.activeLabelStyle
                  ]}>{item.label}</Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
        </View>
      </View>
    );
  }
}

DropDownPicker.defaultProps = {
  defaultNull: false,
  iconUp: null,
  iconDown: null,
  placeholder: 'Select an item',
  dropDownMaxHeight: 150,
  style: {},
  containerStyle: {},
  itemStyle: {},
  labelStyle: {},
  activeItemStyle: {},
  activeLabelStyle: {},
  arrowStyle: {},
  showArrow: true,
  arrowSize: 15,
  customArrowUp: null,
  customArrowDown: null,
  zIndex: 5000,
  disabled: false,
  onChangeItem: () => { },
};

DropDownPicker.propTypes = {
  items: PropTypes.array.isRequired,
  defaultIndex: PropTypes.number,
  defaultValue: PropTypes.any,
  defaultNull: PropTypes.bool,
  placeholder: PropTypes.string,
  dropDownMaxHeight: PropTypes.number,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  itemStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  activeItemStyle: PropTypes.object,
  activeLabelStyle: PropTypes.object,
  showArrow: PropTypes.bool,
  arrowStyle: PropTypes.object,
  arrowSize: PropTypes.number,
  customArrowUp: PropTypes.any,
  customArrowDown: PropTypes.any,
  zIndex: PropTypes.number,
  disabled: PropTypes.bool,
  onChangeItem: PropTypes.func
};

const styles = StyleSheet.create({
  arrow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  dropDown: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderTopWidth: 1.0,
    borderRightWidth: 1.0,
    borderBottomWidth: 1.0,
    borderColor: '#B7B7B7',
    borderStyle: 'solid'
  },
  dropDownBase: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderTopWidth: 1.0,
    borderLeftWidth: 1.0,
    borderBottomWidth: 1.0,
    borderColor: '#B7B7B7',
    borderStyle: 'solid'
  },
  dropDownDisplay: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    // width: Dimensions.get('window').width - 80.0,
    flexGrow: 1
  },
  dropDownBox: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    width: '100%'
  },
  dropDownItem: {
    paddingVertical: 8,
    width: '100%',
    justifyContent: 'center'
  },
  hidden: {
    position: 'relative',
    display: 'none'
  },
  noBottomLeftRadius: {
    borderBottomLeftRadius: 0,
  },
  noBottomRightRadius: {
    borderBottomRightRadius: 0,
  }
});

export default DropDownPicker;
