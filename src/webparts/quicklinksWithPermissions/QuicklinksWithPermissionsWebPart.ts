import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IWebPartPropertiesMetadata } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, IPropertyPaneDropdownOption, PropertyPaneDropdown } from "@microsoft/sp-property-pane";
import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType
} from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import * as strings from 'QuicklinksWithPermissionsWebPartStrings';
import QuicklinksWithPermissions from './components/QuicklinksWithPermissions';
import { IQuicklinksWithPermissionsProps } from './components/IQuicklinksWithPermissionsProps';
import SiteServices from "./../services/SiteServices";

export interface IQuicklinksWithPermissionsWebPartProps {
  collectionData: any[];
  restrictedGroup : string;
  title: string;
}

export default class QuicklinksWithPermissionsWebPart extends BaseClientSideWebPart<IQuicklinksWithPermissionsWebPartProps> {

  private dropdownOptions: IPropertyPaneDropdownOption[] = [];
  private loadingIndicator: boolean = true;

  public render(): void {
    const siteServices = new SiteServices(this.context);
    const groupName = this.properties.restrictedGroup? this.properties.restrictedGroup : '';
    siteServices.checkUserInGroup(groupName).then(isInGroup =>{
      const element: React.ReactElement<IQuicklinksWithPermissionsProps > = React.createElement(
        QuicklinksWithPermissions,
        {
          title: this.properties.title,
          fUpdateProperty: (value: string) => {
            this.properties.title = value;
          },
          displayMode : this.displayMode,
          collectionData: this.properties.collectionData? this.properties.collectionData : [],
          userInRestrictedGroup : isInGroup,
          fPropertyPaneOpen: this.context.propertyPane.open
        }
      );
      ReactDom.render(element, this.domElement);
    });
  }

  protected onPropertyPaneConfigurationStart(): void {
    this.getSiteGroups().then((response) => {
      this.dropdownOptions = response;
      this.context.propertyPane.refresh();
      this.loadingIndicator = false;
    });
  }

  protected getSiteGroups = () =>{
    return new Promise<IPropertyPaneDropdownOption[]>(async (resolve, reject) => {
      try {
        let options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
        const siteServices = new SiteServices(this.context);
        const groups = await siteServices.getSiteGroupNames();
        for (const group of groups) {
          options.push({
            key : group,
            text : group
          });
        }
        resolve(options);
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      'collectionData': { isSearchablePlainText: true }
    };
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      showLoadingIndicator: this.loadingIndicator,
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldCollectionData("collectionData", {
                  key: "collectionData",
                  label: "Edit Links",
                  panelHeader: "Edit links",
                  manageBtnLabel: "Edit Links",
                  value: this.properties.collectionData,
                  fields: [
                    {
                      id: "name",
                      title: "Name of the link",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "linkURL",
                      title: "URL of Link",
                      type: CustomCollectionFieldType.url,
                      required: true
                    },
                    {
                      id: "description",
                      title: "Short description of link",
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "iconName",
                      title: "Fabric Icon",
                      type: CustomCollectionFieldType.fabricIcon
                    },
                    {
                      id: "isRestricted",
                      title: "Is restricted?",
                      type: CustomCollectionFieldType.boolean,
                    }
                  ],
                  disabled: false
                }),
                PropertyPaneDropdown('restrictedGroup', {
                  label: "Select Restricted Group",
                  options: this.dropdownOptions,
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
