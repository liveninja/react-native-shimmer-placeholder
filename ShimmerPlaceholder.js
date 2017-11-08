/* @flow */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Animated,
  Easing
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class ShimmerPlaceHolder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      positionVerticalLine: new Animated.Value(-this.WIDTH_LINE),
      isDisplayChildComponent: this.props.isDisplayChildComponent ? this.props.isDisplayChildComponent : false
    };
    this.WIDTH = this.props.width;
    this.HEIGHT = this.props.height;
    this.WIDTH_LINE = this.props.widthLine;
    this.refreshIntervalId = null;
    this.positionVerticalLine = new Animated.Value(-this.WIDTH_LINE);
    this.duration = this.props.duration;
    this.colorShimmer = this.props.colorShimmer;
    if (this.props.reverse === true ) {
      this.begin = this.WIDTH;
      this.end = -this.WIDTH_LINE;
    }else {
      this.begin = -this.WIDTH_LINE;
      this.end = this.WIDTH;
    }
  }
  componentDidMount() {
    if (this.props.autoRun== true){
      this.runAnimatedAuto()
    }
  }
  runAnimated = () =>  {
    this.positionVerticalLine.setValue(this.begin)
    return Animated.timing(this.positionVerticalLine, { // The value to drive
      toValue: this.end, // Target
      duration: this.props.duration, // Configuration
        isInteraction: false,
        useNativeDriver: true,
    })
  }
  runAnimatedAuto() {
    this.positionVerticalLine.setValue(this.begin)
    Animated.timing(this.positionVerticalLine, { // The value to drive
      toValue: this.end, // Target
      duration: this.props.duration, // Configuration
      easing: Easing.linear,
      isInteraction: false,
        useNativeDriver: true,
    }).start((event) => {
      if (!this.state.isDisplayChildComponent) {
        this.runAnimatedAuto()
      }
    })
  }

  componentWillReceiveProps({ isDisplayChildComponent }){
    if(isDisplayChildComponent!=undefined&&isDisplayChildComponent!=this.state.isDisplayChildComponent){
      this.setState({
        isDisplayChildComponent: isDisplayChildComponent
      })
    }
  }
  renderShimmerLoading() {
    const { colorShimmer } = this
    if (!this.state.isDisplayChildComponent) return (
      <Animated.View
        style={[
          styles.lineComponent, {
            width: this.WIDTH_LINE,
            transform:[{translateX: this.positionVerticalLine}]
          }
      ]}>
        <LinearGradient
          colors={['#ebebeb', colorShimmer, '#ebebeb']}
          style={styles.linearGradient}
          start={{
            x: 0,
            y: 0.25
          }}
          end={{
            x: 1,
            y: 0.25
          }}
          locations={ [0.1, 0.5, 0.9] }>
          </LinearGradient>
      </Animated.View>
    )
  }
  render () {
    const {isDisplayChildComponent} = this.state;
    return (
      <View>
        <View style={!isDisplayChildComponent?[
          {
            height: this.HEIGHT,
            width: this.WIDTH
          },
          styles.container,
          this.props.style
        ]:[]}>

          {this.renderShimmerLoading()}
          <View style={!isDisplayChildComponent?{ width: 0,height: 0 }:{}}>
            {this.props.children}
          </View>
        </View>
      </View>
    )
  }
}
ShimmerPlaceHolder.defaultProps = {
  width: 200,
  height: 15,
  widthLine: 90,
  duration: 300,
  colorShimmer: '#ddd',
  reverse: false,
  autoRun: false,
};
ShimmerPlaceHolder.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  widthLine: PropTypes.number,
  duration: PropTypes.number,
  colorShimmer: PropTypes.string,
  reverse: PropTypes.bool,
  autoRun: PropTypes.bool,
};
export default ShimmerPlaceHolder;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ebebeb',
    overflow: 'hidden',
  },
  lineComponent: {
    flex: 1,
    position: 'relative',
  },
  linearGradient: {
    flex: 1,
  },
});
