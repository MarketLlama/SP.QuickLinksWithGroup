import * as React from 'react';
import { getRTL } from 'office-ui-fabric-react/lib/Utilities';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { List } from 'office-ui-fabric-react/lib/List';
import styles from '../QuicklinksWithPermissions.module.scss';
import { IQuickLinkItem } from './IQuickLinkItem';
import { render } from 'react-dom';

export interface QuickLinksProps {
  items: IQuickLinkItem[];
  userInRestricted : boolean;
}

export interface QuickLinksState {
  items?: IQuickLinkItem[];
}

class QuickLinks extends React.Component<QuickLinksProps, QuickLinksState> {
  constructor(props: QuickLinksProps) {
    super(props);
    this.state = {
      items: props.items
    };
  }
  public render(): JSX.Element {
    let { items = [] } = this.state;

    //filter the restricted if user is not in the restricted group
    if(!this.props.userInRestricted){
      items = items.filter(item =>{
        return (item.isRestricted != true);
      });
    }

    return (
      <FocusZone direction={FocusZoneDirection.vertical}>
        <List items={items} onRenderCell={this._onRenderCell} />
      </FocusZone>
    );
  }

  private _onRenderCell = (item: IQuickLinkItem): JSX.Element => {
    return (
      <div className={styles.itemCell} data-is-focusable={true} onClick={() => window.location.href = item.linkURL}>
        <Icon iconName={item.iconName}
          className={styles.itemIcon + ' ' + (item.isRestricted? styles.itemRestricted : '')}/>
        <div className={styles.itemContent}>
          <div className={styles.itemName}>{item.name}</div>
          <div>{item.description}</div>
        </div>
        <Icon className={styles.chevron} iconName={getRTL() ? 'ChevronLeft' : 'ChevronRight'} />
      </div>
    );
  }
}

export default QuickLinks;
