import * as React from 'react';
import styles from './QuicklinksWithPermissions.module.scss';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { IQuicklinksWithPermissionsProps } from './IQuicklinksWithPermissionsProps';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import QuickLinks  from './quickLinks/QuickLinks';

export default class QuicklinksWithPermissions extends React.Component<IQuicklinksWithPermissionsProps, {}> {
  public render(): React.ReactElement<IQuicklinksWithPermissionsProps> {
    return (
      <div className={ styles.quicklinksWithPermissions }>
        <div className={ styles.container }>
          <WebPartTitle
            displayMode={this.props.displayMode}
            title={this.props.title}
            updateProperty={this.props.fUpdateProperty} />
          {this.props.collectionData && this.props.collectionData.length > 0 ? (
            <QuickLinks items={this.props.collectionData}
              userInRestricted={this.props.userInRestrictedGroup} />
            ) : (
            <Placeholder
              iconName='Edit'
              iconText={'Configure your quick links'}
              description={'Please configure the web part in order to show links'}
              buttonLabel={'Configure'}
              onConfigure={this.props.fPropertyPaneOpen} />
          )}
        </div>
      </div>
    );
  }
}
