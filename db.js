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

Page.hasMany(Page, { as: 'children', foreignKey: 'parentId' });
// creates a self-referential connection for parent/children pages

Placement.belongsTo(Page);
Placement.belongsTo(Content);
Content.hasMany(Placement);

module.exports = { conn, Page, Content, Placement };
