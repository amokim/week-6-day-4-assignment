require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { faker } = require('@faker-js/faker');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Fixed seed: every run produces the same "random" data, so results are consistent
faker.seed(2026);

// ---------------------------------------------------------------------------
// Kenyan data helpers
// ---------------------------------------------------------------------------

const kenyanFirstNames = [
  'Wanjiku', 'Ochieng', 'Amina', 'Njoroge', 'Fatuma',
  'Kipchoge', 'Nyambura', 'Otieno', 'Chebet', 'Muthoni',
  'Kamau', 'Akinyi', 'Baraka', 'Zawadi', 'Njeri',
];

const kenyanLastNames = [
  'Kamau', 'Otieno', 'Wafula', 'Mwangi', 'Hassan',
  'Rono', 'Wanjiru', 'Oduor', 'Kosgei', 'Njeri',
  'Omondi', 'Cheruiyot', 'Mutua', 'Kiptoo', 'Odhiambo',
];

const nairobiNeighborhoods = [
  'Westlands', 'Kilimani', 'Karen', 'Lavington', 'Kileleshwa',
  'South B', 'South C', 'Parklands', 'Runda', 'Langata',
  'Eastleigh', 'Kasarani', 'Ruaka', 'Rongai', 'Kitengela',
];

const kenyanTowns = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
  'Thika', 'Nyeri', 'Meru', 'Lamu', 'Malindi',
];

// Uses faker instead of Math.random so faker.seed() makes results repeatable
const pick = (array) => faker.helpers.arrayElement(array);

function generateKenyanName() {
  return `${pick(kenyanFirstNames)} ${pick(kenyanLastNames)}`;
}

function generateKenyanPhone() {
  const prefixes = ['0712', '0722', '0733', '0700', '0110', '0111', '0741', '0758'];
  return `${pick(prefixes)}${faker.string.numeric(6)}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgoDate = (days) => new Date(Date.now() - days * DAY_MS);

// Random date between `maxDaysAgo` and `minDaysAgo` days in the past
const dateBetweenDaysAgo = (maxDaysAgo, minDaysAgo) =>
  faker.date.between({ from: daysAgoDate(maxDaysAgo), to: daysAgoDate(minDaysAgo) });

// ---------------------------------------------------------------------------
// Blog data
// ---------------------------------------------------------------------------

// Required users from Task 1 (phone numbers are added during e-commerce seeding)
const users = [
  { name: 'Wanjiku Kamau', email: 'wanjiku@example.com', bio: 'Tech writer from Westlands, Nairobi' },
  { name: 'Ochieng Otieno', email: 'ochieng@example.com', bio: 'Full-stack developer in Kisumu' },
  { name: 'Amina Wafula', email: 'amina@example.com', bio: 'UI/UX designer from Nyali, Mombasa' },
  { name: 'Njoroge Mwangi', email: 'njoroge@example.com', bio: 'CS student at JKUAT, Juja' },
  { name: 'Fatuma Hassan', email: 'fatuma@example.com', bio: 'Data analyst from Lamu' },
  { name: 'Kipchoge Rono', email: 'kipchoge@example.com', bio: 'Mobile developer from Eldoret' },
  { name: 'Nyambura Wanjiru', email: 'nyambura@example.com', bio: 'Backend engineer in Karen, Nairobi' },
  { name: 'Otieno Oduor', email: 'otieno@example.com', bio: 'DevOps specialist from Kisumu' },
  { name: 'Chebet Kosgei', email: 'chebet@example.com', bio: 'Product manager from Kericho' },
  { name: 'Muthoni Njeri', email: 'muthoni@example.com', bio: 'Startup founder in Kilimani, Nairobi' },
];

const tagNames = [
  'javascript', 'react', 'nodejs', 'prisma',
  'career', 'tutorial', 'kenya-tech', 'ai',
];

// Curated post catalog: title, content and tags stay hand-written so they make sense together.
// author = index into `users`. Dates, likes and published/draft status are generated with faker.
const posts = [
  {
    author: 0, tags: ['javascript', 'career', 'kenya-tech'],
    title: 'Why Every Kenyan Developer Should Learn TypeScript',
    content: 'Most of the remote job listings I see from European and American companies now list TypeScript as a requirement, not a nice-to-have. Learning it made me catch bugs before my clients did, and it doubled the number of interviews I landed this year.',
  },
  {
    author: 0, tags: ['career', 'kenya-tech'],
    title: 'Setting Up a Home Office in Nairobi on a Budget',
    content: 'You do not need a fancy co-working membership to be productive. With a second-hand monitor from Luthuli Avenue, a decent chair, and a backup power bank for the inevitable KPLC outage, I built a setup for under KES 30,000.',
  },
  {
    author: 0, tags: ['ai', 'career'],
    title: 'Writing Technical Docs That Developers Actually Read',
    content: 'Documentation is a product, and like any product it needs a clear audience. In this post I share the structure I use for every README and API guide I write for clients.',
  },
  {
    author: 1, tags: ['nodejs', 'kenya-tech'],
    title: 'Integrating M-Pesa Daraja API with Node.js',
    content: 'The Daraja API can feel intimidating at first because of the OAuth flow and callback URLs. This post walks through STK Push step by step using Express, with tips on testing callbacks locally using ngrok.',
  },
  {
    author: 1, tags: ['react', 'nodejs', 'tutorial'],
    title: 'Building a Full-Stack App from Kisumu with React and Express',
    content: 'I built a matatu route finder for Kisumu over a long weekend. Here is how I structured the React frontend, the Express API, and how I deployed both for free.',
  },
  {
    author: 1, tags: ['prisma', 'nodejs'],
    title: 'Prisma Migrations Without the Headaches',
    content: 'Migrations went wrong for me twice in production before I learned to treat them like code. These are the rules I now follow: small migrations, always review the SQL, and never edit an applied migration.',
  },
  {
    author: 2, tags: ['react', 'tutorial'],
    title: 'Designing Accessible Forms in React',
    content: 'Accessibility is often an afterthought in Kenyan startups, but it should not be. In this tutorial I show how labels, error messages, and focus management make your forms usable for everyone.',
  },
  {
    author: 2, tags: ['kenya-tech', 'career'],
    title: 'What Mombasa Taught Me About UX Design',
    content: 'Watching shopkeepers in Old Town use mobile money taught me more about user experience than any course. People want speed, clarity, and confidence that their money went through.',
  },
  {
    author: 2, tags: ['react'],
    title: 'Design Tokens for Small Teams',
    content: 'Design tokens sound like an enterprise thing, but they save small teams a lot of time. This post covers how we introduced them with just a JSON file and CSS variables.',
  },
  {
    author: 3, tags: ['career', 'javascript'],
    title: 'From Jua Kali to JavaScript: My Coding Journey',
    content: 'Before JKUAT, I spent two years fixing welding machines with my uncle in Gikomba. The same problem-solving mindset is what helps me debug JavaScript today, and I want other students to know where they come from is an asset.',
  },
  {
    author: 3, tags: ['javascript', 'tutorial'],
    title: 'Understanding JavaScript Closures as a CS Student',
    content: 'Closures confused me for an entire semester until I stopped reading definitions and started writing tiny examples. Here are the five examples that finally made it click.',
  },
  {
    author: 3, tags: ['ai', 'career'],
    title: 'Should Students Use AI to Learn Programming?',
    content: 'My classmates are split on whether AI assistants help or hurt learning. This post collects arguments from both sides and my own experience using them for revision.',
  },
  {
    author: 4, tags: ['ai', 'tutorial'],
    title: 'Analysing Kenyan Agricultural Data with Python and AI',
    content: 'Open data from the Kenya National Bureau of Statistics is surprisingly rich. I used it to predict maize yields by county and share my notebook and lessons learned here.',
  },
  {
    author: 4, tags: ['kenya-tech', 'career'],
    title: 'Working Remotely from Lamu: The Good and the Bad',
    content: 'Lamu is beautiful, quiet, and terrible for video calls on some days. After six months of working remotely from the island, here is my honest review of internet options and routines.',
  },
  {
    author: 4, tags: ['javascript', 'tutorial'],
    title: 'Building Dashboards with Chart.js',
    content: 'Not every dashboard needs a heavy BI tool. With Chart.js and a simple JSON endpoint, I built a sales dashboard for a Lamu hotel in an afternoon.',
  },
  {
    author: 5, tags: ['react', 'javascript'],
    title: 'React Native vs Flutter for Kenyan Startups',
    content: 'I have shipped apps in both frameworks for clients in Eldoret and Nairobi. The right choice depends on your team, and in this post I break down hiring, performance, and tooling.',
  },
  {
    author: 5, tags: ['kenya-tech', 'tutorial'],
    title: 'Building Offline-First Mobile Apps for Rural Kenya',
    content: 'Many of our users in the Rift Valley have patchy connectivity. Designing for offline first means caching data locally and syncing when the network returns, and this post explains how.',
  },
  {
    author: 5, tags: ['react'],
    title: 'Speeding Up React Native Builds',
    content: 'Slow builds kill momentum. In this post I document the caching and configuration tweaks that cut our Android build time in half.',
  },
  {
    author: 6, tags: ['nodejs', 'prisma'],
    title: 'Designing a Clean REST API with Express and Prisma',
    content: 'A good API is predictable. I share the folder structure, error handling, and validation patterns I use for every Express and Prisma project at work.',
  },
  {
    author: 6, tags: ['prisma', 'tutorial'],
    title: 'Seeding Your Database Like a Pro',
    content: 'Realistic seed data makes development and demos much smoother. This tutorial shows how to write an idempotent seed script and why clearing tables in the right order matters.',
  },
  {
    author: 6, tags: ['nodejs'],
    title: 'Queue Workers in Node.js Explained',
    content: 'Background jobs keep your API fast. This post explains when to reach for a queue and compares a few popular options for Node.js.',
  },
  {
    author: 7, tags: ['nodejs', 'tutorial'],
    title: 'Deploying Node Apps on a KES 500 VPS',
    content: 'You can host a small production app for less than the price of lunch. I walk through setting up a cheap VPS, Nginx, PM2, and free SSL certificates.',
  },
  {
    author: 7, tags: ['career', 'kenya-tech'],
    title: 'Getting Into DevOps in Kenya',
    content: 'DevOps roles are growing fast in Nairobi and Kisumu, but the path in is not always clear. Here is the roadmap I wish I had when I started, including certifications that actually helped.',
  },
  {
    author: 7, tags: ['ai', 'nodejs'],
    title: 'Monitoring AI Workloads in Production',
    content: 'AI features fail in new and interesting ways. I share the metrics and alerts we added to catch slow responses and unexpected costs before users noticed.',
  },
  {
    author: 8, tags: ['kenya-tech', 'ai'],
    title: 'The State of AI Startups in East Africa',
    content: 'From agritech in Kericho to fintech in Nairobi, AI startups in the region are solving local problems. I spoke to five founders about funding, talent, and what comes next.',
  },
  {
    author: 8, tags: ['career'],
    title: 'What Product Managers Wish Developers Knew',
    content: 'Most friction between product and engineering comes from missing context. These are the conversations I have learned to have early to keep teams aligned.',
  },
  {
    author: 8, tags: ['career', 'kenya-tech'],
    title: 'Running User Interviews in Swahili',
    content: 'Interviewing users in their first language uncovers insights you would otherwise miss. This post covers how I prepare scripts and translate findings for the team.',
  },
  {
    author: 9, tags: ['kenya-tech', 'career'],
    title: 'How I Built My First SaaS Product from Kibera',
    content: 'I started building our invoicing tool on a shared laptop in a Kibera community tech hub. Two years later we serve over 400 small businesses, and here is what I learned along the way.',
  },
  {
    author: 9, tags: ['react', 'tutorial'],
    title: 'React Server Components Explained Simply',
    content: 'Server Components let you fetch data on the server and send less JavaScript to the browser. I explain the mental model with a simple example from our own product.',
  },
  {
    author: 9, tags: ['ai', 'kenya-tech', 'javascript'],
    title: 'Adding AI Features to a Kenyan SaaS on a Shoestring',
    content: 'AI features do not have to burn through your runway. We added smart invoice categorisation for a few dollars a month, and I break down exactly how.',
  },
];


// Comment templates: hand-written so they read naturally; faker fills in the
// names and places so each run produces varied but sensible comments.
const commentTemplates = [
  () => 'This is exactly what I needed today, asante sana!',
  () => 'Great write-up. Could you share the repo link?',
  () => 'I ran into the same issue last month. Your solution is much cleaner than mine.',
  () => 'Very relatable post, especially the part about power outages!',
  () => 'Would love a follow-up post that goes deeper into this.',
  () => 'Hii ni moto! Thanks for sharing your experience.',
  () => 'I disagree slightly on one point, but overall a solid article.',
  () => 'How did you handle testing for this setup?',
  () => 'Can you do a video version of this tutorial?',
  () => 'Mazuri sana! Looking forward to the next post.',
  () => `Reading this on a matatu to ${pick(nairobiNeighborhoods)}. Great insights!`,
  () => `Shared this with our developer meetup in ${pick(kenyanTowns)}. Everyone found it useful.`,
  () => `Do you have any recommendations for beginners in ${pick(kenyanTowns)}?`,
  () => `My colleague ${generateKenyanName()} recommended this post and I am glad they did.`,
  () => `${generateKenyanName()} and I tried this at our co-working space in ${pick(nairobiNeighborhoods)}. Worked perfectly.`,
  () => `Proud to see more developers from ${pick(kenyanTowns)} writing content like this.`,
  () => `Tagging my friend ${generateKenyanName()}, who has been asking about exactly this.`,
  () => `We need more meetups like this in ${pick(kenyanTowns)}. Thanks for writing it up.`,
];

// ---------------------------------------------------------------------------
// E-commerce data
// ---------------------------------------------------------------------------

const categories = [
  { name: 'Electronics', description: 'Phones, laptops, and accessories' },
  { name: 'Clothing', description: 'Fashion and apparel' },
  { name: 'Food & Groceries', description: 'Fresh produce and packaged food' },
  { name: 'Home & Kitchen', description: 'Household items and kitchen equipment' },
  { name: 'Books & Stationery', description: 'Books, notebooks, and office supplies' },
];

// Curated product catalog. price = [min, max] realistic KES range; faker picks
// the actual price, stock and rating.
const products = [
  // Electronics
  { category: 'Electronics', name: 'Samsung Galaxy A14', description: '6.6" display, 64GB storage, dual SIM', price: [17500, 19500] },
  { category: 'Electronics', name: 'Tecno Spark 20', description: '128GB storage, 50MP camera, 5000mAh battery', price: [13000, 15000] },
  { category: 'Electronics', name: 'HP Laptop 15', description: 'Intel Core i5, 8GB RAM, 512GB SSD', price: [60000, 70000] },
  { category: 'Electronics', name: 'Oraimo Earbuds', description: 'Wireless earbuds with charging case', price: [2000, 3000] },
  // Clothing
  { category: 'Clothing', name: 'Ankara Print Shirt', description: 'Short-sleeve cotton shirt in bold Ankara print', price: [1000, 1500] },
  { category: 'Clothing', name: 'Maasai Shuka Scarf', description: 'Traditional red checked shuka, handwoven', price: [600, 1000] },
  { category: 'Clothing', name: 'Kitenge Dress', description: 'Tailored midi dress in kitenge fabric', price: [2500, 3500] },
  { category: 'Clothing', name: 'Bata Safari Boots', description: 'Durable leather boots for everyday wear', price: [3000, 4000] },
  // Food & Groceries
  { category: 'Food & Groceries', name: 'Jogoo Maize Flour 2kg', description: 'Fortified sifted maize meal for ugali', price: [160, 200] },
  { category: 'Food & Groceries', name: 'Brookside Milk 500ml', description: 'Fresh long-life whole milk', price: [60, 70] },
  { category: 'Food & Groceries', name: 'Ketepa Pride Tea 500g', description: 'Premium Kenyan black tea leaves', price: [250, 320] },
  { category: 'Food & Groceries', name: 'Kabras Sugar 2kg', description: 'Locally produced white sugar', price: [300, 360] },
  // Home & Kitchen
  { category: 'Home & Kitchen', name: 'Aluminium Sufuria Set', description: 'Set of 5 aluminium cooking pots with lids', price: [4000, 5000] },
  { category: 'Home & Kitchen', name: 'Mwiko (Wooden Spoon)', description: 'Hand-carved wooden cooking stick', price: [100, 200] },
  { category: 'Home & Kitchen', name: 'Ramtons Electric Kettle', description: '1.7L stainless steel cordless kettle', price: [2400, 3000] },
  { category: 'Home & Kitchen', name: 'Jiko Kisasa Charcoal Stove', description: 'Energy-saving ceramic-lined charcoal jiko', price: [1500, 2200] },
  // Books & Stationery
  { category: 'Books & Stationery', name: 'Weep Not Child - Ngugi', description: 'Classic novel by Ngugi wa Thiong\'o', price: [850, 1100] },
  { category: 'Books & Stationery', name: 'A4 Counter Book', description: '200-page hardcover ruled counter book', price: [100, 150] },
  { category: 'Books & Stationery', name: 'The River and the Source - Ogola', description: 'Award-winning novel by Margaret Ogola', price: [950, 1250] },
  { category: 'Books & Stationery', name: 'Bic Pens (Pack of 10)', description: 'Blue ballpoint pens', price: [200, 300] },
];

// Round prices the way shops do: to the nearest 5 for cheap items, 10, 50 or 100 for dearer ones
function roundPrice(price) {
  const step = price >= 10000 ? 100 : price >= 1000 ? 50 : price >= 100 ? 10 : 5;
  return Math.round(price / step) * step;
}

// Order targets: 15 orders with 38 items in total
const orderStatuses = [
  ...Array(6).fill('delivered'),
  ...Array(3).fill('shipped'),
  ...Array(4).fill('pending'),
  ...Array(2).fill('cancelled'),
];
const itemsPerOrder = [3, 2, 4, 1, 3, 2, 4, 2, 3, 1, 4, 2, 3, 2, 2]; // 1-4 each, sums to 38

// How long ago an order with each status was placed: [maxDaysAgo, minDaysAgo]
const orderAgeByStatus = {
  delivered: [90, 14],
  cancelled: [60, 5],
  shipped: [10, 2],
  pending: [2, 0],
};

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data (children before parents to respect foreign keys)
  await prisma.comment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.post.deleteMany(); // also removes implicit Post<->Tag join rows
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared existing data.');

  // 2. Users
  const createdUsers = [];
  for (const user of users) {
    createdUsers.push(await prisma.user.create({ data: user }));
  }
  console.log(`Created ${createdUsers.length} users.`);

  // 3. Tags
  await prisma.tag.createMany({ data: tagNames.map((name) => ({ name })) });
  console.log(`Created ${tagNames.length} tags.`);

  // 4. Posts (with 1-3 tags each). 5 random posts are drafts, the rest published.
  const DRAFT_COUNT = 5;
  const draftTitles = new Set(
    faker.helpers.arrayElements(posts, DRAFT_COUNT).map((post) => post.title),
  );

  const createdPosts = [];
  for (const post of posts) {
    const created = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        published: !draftTitles.has(post.title),
        likes: faker.number.int({ min: 0, max: 100 }),
        createdAt: faker.date.recent({ days: 90 }), // within the last 3 months
        author: { connect: { id: createdUsers[post.author].id } },
        tags: { connect: post.tags.map((name) => ({ name })) },
      },
    });
    createdPosts.push(created);
  }
  const publishedPosts = createdPosts.filter((p) => p.published);
  const draftCount = createdPosts.length - publishedPosts.length;
  console.log(`Created ${createdPosts.length} posts (${publishedPosts.length} published, ${draftCount} drafts).`);

  // 5. Comments (50, only on published posts, never by the post's author).
  // Every published post gets at least one comment; the rest are spread randomly.
  const TOTAL_COMMENTS = 50;
  const commentTargets = [
    ...publishedPosts,
    ...Array.from({ length: TOTAL_COMMENTS - publishedPosts.length }, () => pick(publishedPosts)),
  ];

  for (const post of commentTargets) {
    const commenter = pick(createdUsers.filter((user) => user.id !== post.authorId));

    await prisma.comment.create({
      data: {
        text: pick(commentTemplates)(),
        createdAt: faker.date.between({ from: post.createdAt, to: new Date() }),
        post: { connect: { id: post.id } },
        user: { connect: { id: commenter.id } },
      },
    });
  }
  console.log(`Created ${commentTargets.length} comments.`);

  // 6. Summary (counted from the database)
  const [userCount, postCount, commentCount, tagCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.tag.count(),
  ]);

  console.log('\nBlog seeding complete!');
  console.log(`  Users: ${userCount}`);
  console.log(`  Posts: ${postCount}`);
  console.log(`  Comments: ${commentCount}`);
  console.log(`  Tags: ${tagCount}`);

  await seedEcommerce(createdUsers);

  console.log('\nFull seed complete!');
}

async function seedEcommerce(createdUsers) {
  console.log('\nE-commerce seeding...');

  // 1. Categories
  const categoryIds = {};
  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    categoryIds[created.name] = created.id;
  }
  console.log(`Created ${categories.length} categories.`);

  // 2. Products: faker picks price (within a realistic KES range), stock and rating.
  // 3 random products are out of stock.
  const OUT_OF_STOCK_COUNT = 3;
  const outOfStockNames = new Set(
    faker.helpers.arrayElements(products, OUT_OF_STOCK_COUNT).map((product) => product.name),
  );

  const createdProducts = [];
  for (const { category, price: [minPrice, maxPrice], ...product } of products) {
    const created = await prisma.product.create({
      data: {
        ...product,
        price: roundPrice(faker.number.int({ min: minPrice, max: maxPrice })),
        stock: outOfStockNames.has(product.name) ? 0 : faker.number.int({ min: 5, max: 200 }),
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        category: { connect: { id: categoryIds[category] } },
      },
    });
    createdProducts.push({ id: created.id, price: Number(created.price), stock: created.stock, category });
  }
  console.log(`Created ${createdProducts.length} products.`);

  // 3. Reuse blog users as customers: add a generated Kenyan phone number to each bio
  for (const user of createdUsers) {
    await prisma.user.update({
      where: { id: user.id },
      data: { bio: `${user.bio}. Contact: ${generateKenyanPhone()}` },
    });
  }
  console.log(`Updated ${createdUsers.length} users with phone info.`);

  // 4. Orders with items (item price = product price at time of order).
  // Every customer gets at least one order; the remaining orders go to random customers.
  const statuses = faker.helpers.shuffle(orderStatuses);
  const itemCounts = faker.helpers.shuffle(itemsPerOrder);
  const customers = [
    ...faker.helpers.shuffle(createdUsers),
    ...Array.from({ length: statuses.length - createdUsers.length }, () => pick(createdUsers)),
  ];
  const inStockProducts = createdProducts.filter((product) => product.stock > 0);

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    // Open orders (pending/shipped) can only contain products that are in stock
    const available = status === 'pending' || status === 'shipped' ? inStockProducts : createdProducts;

    const items = faker.helpers.arrayElements(available, itemCounts[i]).map((product) => ({
      // Groceries are bought in bulk; everything else 1-2 at a time
      quantity: product.category === 'Food & Groceries'
        ? faker.number.int({ min: 1, max: 6 })
        : faker.number.int({ min: 1, max: 2 }),
      price: product.price,
      product: { connect: { id: product.id } },
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await prisma.order.create({
      data: {
        status,
        totalAmount,
        createdAt: dateBetweenDaysAgo(...orderAgeByStatus[status]),
        customer: { connect: { id: customers[i].id } },
        items: { create: items },
      },
    });
  }
  console.log(`Created ${statuses.length} orders with items.`);

  // 5. Summary (counted from the database)
  const [categoryCount, productCount, orderCount, orderItemCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.orderItem.count(),
  ]);

  console.log('\nE-commerce seeding complete!');
  console.log(`  Categories: ${categoryCount}`);
  console.log(`  Products: ${productCount}`);
  console.log(`  Orders: ${orderCount}`);
  console.log(`  Order Items: ${orderItemCount}`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
