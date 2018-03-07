import PropTypes from "prop-types";
import { Subscribe } from "unstated";

const registerContainer = (api, instance) => {
  api.registerContainer({
    container: instance.constructor,
    state: instance.state
  });

  const oldSetState = instance.setState.bind(instance);

  instance.setState = change => {
    const oldState = instance.state;

    oldSetState(change);

    api.stateChange({
      container: instance.constructor,
      oldState,
      change,
      newState: instance.state
    });
  };
};

export class DevToolsSubscribe extends Subscribe {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    if (!props.inject) return;

    props.inject.forEach(instance => registerContainer(props.api, instance));
  }

  componentWillReceiveProps() {}

  componentWillUnmount() {}

  _unsubscribe() {}

  _createInstances(map) {
    const oldSet = map.set.bind(map);
    map.set = (Container, instance) => {
      registerContainer(this.props.api, instance);
      oldSet(Container, instance);
    };
  }
}
