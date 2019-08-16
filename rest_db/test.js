const UnitOfWork = require("./models/UnitOfWorkFactory")
const { jwt : link_schema } = require('link_schema')
const logger = require("link_logger")
// const MockData = require("./service/MockData");
// const MovieData = require("./service/MovieData");

//mock data
// let db = UnitOfWork.create((uow) => {
// 	let data = new MockData(uow);
// 	data.getAll((result) => {
// 		result.forEach(movie => console.log(movie.title));
// 	});
// 	uow.complete();
// });

test = async (callback) => {
	await callback(UnitOfWork.getConnection(1))
}
test2 = async () => {
	let mongoConnection
	try {
		mongoConnection = UnitOfWork.getConnection(1)
		let requestSchema = link_schema.requestSchema
		await requestSchema.findOne({}, (err, track) => {
			if (err) {
				logger.error(err)
			}
			else if (track){
				console.log(track)
			}
		})
	} catch (e) {
		logger.error(e)
	} finally {
		mongoConnection.close()
	}
}

test2 ()



// // real data
// let db = UnitOfWork.create((uow) => {
// 	let data = new MovieData(uow);
// 	data.getAll((result) => {
// 		result.forEach(movie => console.log(movie.title));
// 	});
// 	uow.complete();
// });
