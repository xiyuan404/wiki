

export interface Permalink {
  /** 链接的 URL。 */
  link?: string
  /** 链接的标题。 */
  title: string
  /** 链接的内容。 */
  content?: string
  /** 日期 */
  date?: string
  /** 日期文本 */
  dateText?: string
  /** 日期图标 */
  dateIcon?: string
  /** 复制开关 */
  copy?: boolean
  /** 复制的内容 */
  install?: string
}


export interface BioLink {

}


export interface PortfolioLink {

}

export interface PublicSecurityRegistration {
  /** Internet Content Provider */
  icp: string
  icpIcon?: string
  /**  ministry of public security */
  mps: string
  mpsIcon?: string
}

export interface FooterLink {
  icon?: string
  url: string
  name: string
}

export interface FooterGroup {
  icon?: string
  title: string
  links: FooterLink[]
}

export interface FooterData {
  groups: FooterGroup[];
  record: PublicSecurityRegistration;
  author: {
    name: string;
    link: string;
  }
}