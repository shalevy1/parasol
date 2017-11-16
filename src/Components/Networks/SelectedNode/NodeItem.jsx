import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ListItem } from 'material-ui/List';

import TopicChart from './TopicChart';

@observer
export default class NodeItem extends Component {

  render() {

    const appState = this.props.appState;
    const node = this.props.node;
    const key = this.props.nodeKey;
    const isMetadata = this.props.isMetadata ? this.props.isMetadata : false;

    const isFiltered = appState.ui.componentOptions &&
      appState.ui.componentOptions.selectedNode;
    const options = isFiltered ? appState.ui.componentOptions.selectedNode : null;

    let primaryText = '';
    let secondaryText = this.props.key;
    if(!isMetadata) {
      if(!node[key])
        return null;
      primaryText = node[key].toString();
    } else {
      if(!node.metadata[key])
        return null;
      primaryText = node.metadata[key].toString();
    }

    if(typeof(primaryText) == 'boolean') {
      primaryText = primaryText ? 'true' : 'false';
    }

    if(isMetadata)
      secondaryText = `metadata - ${key}`;

    if(isFiltered) {

      const fieldConfig = options.displayedFields.find(f => {
        return isMetadata ? f.field.replace('metadata.', '') == key : f.field == key;
      });

      if(!fieldConfig)
        return null;

      switch(fieldConfig.type) {
        case 'topicChart':
          return <TopicChart
            key={`topicChart-${node.id}-${key}`}
            title={fieldConfig.field}
            topics={appState.selectedNetwork.get('topics')}
            data={this.props.isMetadata ? node.metadata[key] : node[key]}
          />
          break;
        default:
          secondaryText = fieldConfig.label ? fieldConfig.label : secondaryText;
      }

    }

    return <ListItem
      key={`selectednode-${node.id}-${key}`}
      primaryText={primaryText}
      secondaryText={secondaryText}
      innerDivStyle={{margin: 0, padding: '10 8 8'}}
    />;

  }
}

