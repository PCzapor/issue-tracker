import { PrismaClient, Status, Priority } from '@prisma/client';

export const prisma = new PrismaClient();

const issuesData = [
  {
    title: 'Login fails on Safari',
    description: 'Users on Safari 16 get 401 intermittently.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-01-18T10:15:00.000Z'),
  },
  {
    title: 'Button misaligned on mobile',
    description: 'CTA overlaps footer on 360px width.',
    status: Status.closed,
    priority: Priority.medium,
    createdAt: new Date('2025-02-10T08:00:00.000Z'),
  },
  {
    title: 'Password reset email not sent',
    description: 'No email received after requesting password reset.',
    status: Status.in_progress,
    priority: Priority.high,
    createdAt: new Date('2025-02-20T14:22:00.000Z'),
  },
  {
    title: 'Dark mode toggle not persisting',
    description: 'Switching to dark mode resets after page reload.',
    status: Status.open,
    priority: Priority.low,
    createdAt: new Date('2025-03-01T09:45:00.000Z'),
  },
  {
    title: 'Profile picture upload fails',
    description: 'Images larger than 2MB cause 500 error.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-03-05T11:00:00.000Z'),
  },
  {
    title: 'Search results slow',
    description: 'Queries take more than 5 seconds to return.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-03-10T16:15:00.000Z'),
  },
  {
    title: 'Notifications not showing on iOS',
    description: 'Push notifications never appear on iOS 17.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-03-12T10:00:00.000Z'),
  },
  {
    title: 'Broken link on About page',
    description: 'Contact link leads to 404.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-03-15T09:00:00.000Z'),
  },
  {
    title: 'Checkout button unresponsive',
    description: 'Clicking checkout doesn’t proceed to payment.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-03-18T13:30:00.000Z'),
  },
  {
    title: 'Incorrect currency display',
    description: 'Prices show in USD instead of EUR for EU users.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-03-20T15:40:00.000Z'),
  },
  {
    title: 'Accessibility: missing alt text',
    description: 'Images on homepage lack alt attributes.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-03-25T09:30:00.000Z'),
  },
  {
    title: 'Analytics events not firing',
    description: 'Page view events missing in GA4.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-03-28T08:20:00.000Z'),
  },
  {
    title: 'Search bar autofocus broken',
    description: 'Clicking search icon doesn’t focus input.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-01T12:00:00.000Z'),
  },
  {
    title: 'Double email notifications',
    description: 'Users receive duplicate emails on signup.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-05T10:10:00.000Z'),
  },
  {
    title: 'Timezone conversion wrong',
    description: 'Events show UTC instead of local time.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-08T14:45:00.000Z'),
  },
  {
    title: 'Sidebar menu overlaps content',
    description: 'On 1024px screens sidebar covers text.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-12T09:00:00.000Z'),
  },
  {
    title: 'Export to CSV fails',
    description: 'Large exports timeout after 30s.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-15T11:20:00.000Z'),
  },
  {
    title: 'Image carousel not autoplaying',
    description: 'Carousel stuck on first slide.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-18T10:00:00.000Z'),
  },
  {
    title: 'Session timeout too short',
    description: 'Users logged out after 5 minutes inactivity.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-20T15:30:00.000Z'),
  },
  {
    title: 'Keyboard navigation broken',
    description: 'Tabbing skips over input fields.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-22T12:00:00.000Z'),
  },
  {
    title: 'Tooltip flickering',
    description: 'Hover tooltip blinks on Chrome.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-25T10:10:00.000Z'),
  },
  {
    title: 'User roles not saving',
    description: 'Changes in admin panel don’t persist.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-28T14:40:00.000Z'),
  },
  {
    title: 'Cache not invalidating',
    description: 'Old data shown after update until refresh.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-04-30T09:00:00.000Z'),
  },
  {
    title: 'Uncaught error on logout',
    description: 'Console shows TypeError when logging out.',
    status: Status.open,
    priority: Priority.medium,
    createdAt: new Date('2025-05-02T10:30:00.000Z'),
  },
];

const commentsData = [
  {
    issueId: 1,
    body: 'Seeing this too',
    createdAt: new Date('2025-02-01T11:00:00.000Z'),
  },
  {
    issueId: 5,
    body: 'Fails on PNGs above 1.5MB as well',
    createdAt: new Date('2025-03-07T15:00:00.000Z'),
  },
  {
    issueId: 9,
    body: 'Happens only on Chrome 122',
    createdAt: new Date('2025-03-18T15:45:00.000Z'),
  },
  {
    issueId: 14,
    body: 'I received 3 emails, not 2',
    createdAt: new Date('2025-04-05T13:20:00.000Z'),
  },
];

const users = [
  { id: 1, username: 'Bart', password: 'Simpson' },
  { id: 2, username: 'Homer', password: 'Simpson' },
];

async function main() {
  await prisma.issues.createMany({ data: issuesData });
  await prisma.comments.createMany({ data: commentsData });
  await prisma.users.createMany({ data: users });
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
