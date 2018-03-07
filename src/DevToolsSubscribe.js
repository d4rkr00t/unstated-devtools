import PropTypes from "prop-types";
import { Subscribe } from "unstated";

// TODO: Extract Container registration logic
export class DevToolsSubscribe extends Subscribe {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    if (!props.inject) return;

    const api = props.api;
    props.inject.forEach(instance => {
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
    });
  }

  componentWillReceiveProps() {}

  componentWillUnmount() {}

  _unsubscribe() {}

  _createInstances(map) {
    const oldSet = map.set.bind(map);
    const api = this.props.api;
    map.set = (Container, instance) => {
      api.registerContainer({
        container: Container,
        state: instance.state
      });

      const oldSetState = instance.setState.bind(instance);
      instance.setState = change => {
        const oldState = instance.state;
        oldSetState(change);

        api.stateChange({
          container: Container,
          oldState,
          change,
          newState: instance.state
        });
      };

      oldSet(Container, instance);
    };
  }
}
