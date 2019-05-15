import { IQuickLinkItem } from "./quickLinks/IQuickLinkItem";
import { DisplayMode } from "@microsoft/sp-core-library";

export interface IQuicklinksWithPermissionsProps {
  collectionData: IQuickLinkItem[];
  userInRestrictedGroup : boolean;
  title : string;
  displayMode: DisplayMode;
  fPropertyPaneOpen: () => void;
  fUpdateProperty: (value: string) => void;
}
