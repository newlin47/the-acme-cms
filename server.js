const Sequelize = require('sequelize');
const conn = new Sequelize(
	process.env.DATABASE_URL || 'postgres://localhost/the_acme_cms_db'
);

const Page = conn.define('page', {
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV4,
		// creates a non-sequential unique string ID
	},
	name: {
		type: Sequelize.STRING,
	},
});

const Content = conn.define('content', {
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV4,
		// creates a non-sequential unique string ID
	},
	name: {
		type: Sequelize.STRING,
	},
});

const Placement = conn.define('placement', {
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV4,
		// creates a non-sequential unique string ID
	},
	rank: {
		type: Sequelize.INTEGER,
		defaultValue: 5,
	},
});

Page.belongsTo(Page, { as: 'parent' });
// creates a pageId for each page and calls it parentId

Placement.belongsTo(Page);
Placement.belongsTo(Content);

const start = async () => {
	try {
		console.log('starting');
		await conn.sync({ force: true });
		const [
			home,
			staff,
			moe,
			lucy,
			faq,
			products,
			foo,
			bar,
			header,
			footer,
			faq1,
			headquarters,
		] = await Promise.all([
			Page.create({ name: 'home' }),
			Page.create({ name: 'staff' }),
			Page.create({ name: 'moe' }),
			Page.create({ name: 'lucy' }),
			Page.create({ name: 'faq' }),
			Page.create({ name: 'products' }),
			Page.create({ name: 'foo' }),
			Page.create({ name: 'bar' }),
			Content.create({ name: 'header' }),
			Content.create({ name: 'footer' }),
			Content.create({ name: 'faq1' }),
			Content.create({ name: 'headquarters' }),
		]);
		staff.parentId = home.id;
		faq.parentId = home.id;
		products.parentId = home.id;
		moe.parentId = staff.id;
		lucy.parentId = staff.id;
		foo.parentId = products.id;
		bar.parentId = products.id;
		await Promise.all([
			faq.save(),
			staff.save(),
			products.save(),
			moe.save(),
			lucy.save(),
			foo.save(),
			bar.save(),
			Placement.create({ contentId: header.id, pageId: home.id }),
			Placement.create({ contentId: header.id, pageId: faq.id }),
			Placement.create({ contentId: footer.id, pageId: home.id }),
			Placement.create({ contentId: footer.id, pageId: faq.id }),
			Placement.create({ contentId: faq1.id, pageId: home.id }),
			Placement.create({ contentId: headquarters.id, pageId: faq.id }),
			Placement.create({ contentId: headquarters.id, pageId: staff.id }),
		]);
	} catch (ex) {
		console.log(ex);
	}
};

start();
