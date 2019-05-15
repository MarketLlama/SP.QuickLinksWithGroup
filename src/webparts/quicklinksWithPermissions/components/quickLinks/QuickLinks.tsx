import * as React from 'react';
import { getRTL } from 'office-ui-fabric-react/lib/Utilities';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { List } from 'office-ui-fabric-react/lib/List';
import styles from '../QuicklinksWithPermissions.module.scss';
import { IQuickLinkItem } from './IQuickLinkItem';

export interface QuickLinksProps {
  items: IQuickLinkItem[];
}

export interface QuickLinksState {
  filterText?: string;
  items?: IQuickLinkItem[];
}

class QuickLinks extends React.Component<QuickLinksProps, QuickLinksState> {
  constructor(props: QuickLinksProps) {
    super(props);

    this.state = {
      filterText: '',
      items: props.items
    };
  }
  public render(): JSX.Element {
    const { items = [] } = this.state;

    return (
      <FocusZone direction={FocusZoneDirection.vertical}>
        <List items={items} onRenderCell={this._onRenderCell} />
      </FocusZone>
    );
  }

  private _onRenderCell(item: IQuickLinkItem, index: number | undefined): JSX.Element {
    return (
      <div className={styles.itemCell} data-is-focusable={true}>
        <Image className={styles.itemImage} src={item.iconName} width={50} height={50} imageFit={ImageFit.cover} />
        <div className={styles.itemContent}>
          <div className={styles.itemName}>{item.name}</div>
          <div className={styles.itemIndex}>{`Item ${index}`}</div>
          <div>{item.description}</div>
        </div>
        <Icon className={styles.chevron} iconName={getRTL() ? 'ChevronLeft' : 'ChevronRight'} />
      </div>
    );
  }
}

export default QuickLinks;
