import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  params: icon('ic-params'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  deal: icon('ic-ecommerce'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.admin.dashboard,
        icon: ICONS.dashboard,
        info: <Label>v{CONFIG.appVersion}</Label>,
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Products',
        path: paths.admin.products.root,
        icon: ICONS.product,
        children: [
          { title: 'List', path: paths.admin.products.root },
          { title: 'Create', path: paths.admin.products.new },
        ],
      },
      { title: 'Categories', path: paths.admin.categories, icon: ICONS.folder },
      {
        title: 'Combo Deals',
        path: paths.admin.deals.root,
        icon: ICONS.deal,
        children: [
          { title: 'List', path: paths.admin.deals.root },
          { title: 'Create', path: paths.admin.deals.new },
        ],
      },
      {
        title: 'Orders',
        path: paths.admin.orders.root,
        icon: ICONS.order,
      },
      {
        title: 'Reviews',
        path: paths.admin.reviews,
        icon: ICONS.chat,
      },
      {
        title: 'Testimonials',
        path: paths.admin.testimonials,
        icon: ICONS.chat,
      },
      {
        title: 'Training Modules',
        path: paths.admin.trainingModules.root,
        icon: ICONS.course,
        children: [
          { title: 'List', path: paths.admin.trainingModules.root },
          { title: 'Create', path: paths.admin.trainingModules.new },
        ]
      },
      {
        title: 'Customers',
        path: paths.admin.customers.root,
        icon: ICONS.user,
      },
      {
        title: 'Support Tickets',
        path: paths.admin.tickets,
        icon: ICONS.chat,
      },
    ],
  },
  /**
   * Settings
   */
  {
    subheader: 'Settings',
    items: [
      { title: 'Delivery Zones', path: paths.admin.delivery, icon: ICONS.tour },
      { title: 'Coupons', path: paths.admin.coupons, icon: ICONS.invoice },
      { title: 'Admin Users', path: paths.admin.users.root, icon: ICONS.lock },
      { title: 'Settings', path: paths.admin.settings, icon: ICONS.params },
    ],
  },
];
