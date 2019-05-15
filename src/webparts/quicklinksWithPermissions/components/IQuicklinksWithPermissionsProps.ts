import { IQuickLinkItem } from "./quickLinks/IQuickLinkItem";

export interface IQuicklinksWithPermissionsProps {
  collectionData: IQuickLinkItem[];
  userInRestrictedGroup : boolean;
  fPropertyPaneOpen: () => void;
}
