import React from 'react';
import {connect} from 'react-redux';
import BalanceListItem from '../../components/BalanceListItem';
import BalanceCheck from '../../components/BalanceCheck';
import {getEventBalance, getEventsParticipantsDebts} from '../../modules/balance';
import repayDebt from '../../actions/repayDebt';
import BalanceItemPopup from '../../components/BalanceItemPopup';
import BalanceStatus from '../../components/BalanceStatus';

const BalancePage = React.createClass({
	getInitialState() {
		return {
			showPopup: false,
		};
	},

	repayDebtHandler(debt) {
		let oldRepayedFrom = 0;
		let oldRepayedTo = 0;

		if (this.props.eventsById[this.props.eventId].repayedDebts) {
			oldRepayedFrom =
				Math.abs(this.props.eventsById[this.props.eventId].repayedDebts[debt.from])
					|| 0;
			oldRepayedTo =
				Math.abs(this.props.eventsById[this.props.eventId].repayedDebts[debt.to])
					|| 0;
		}

		this.props.dispatch(
			repayDebt(
				this.props.eventId,
				debt.sum,
				debt.from,
				debt.to,
				oldRepayedFrom,
				oldRepayedTo
			)
		);

		this.setState({
			showPopup: false,
		});
	},

	showRepayPopup(debt) {
		this.setState({
			showPopup: true,
			currentDebt: debt,
		});
	},

	closeRepayPopup() {
		this.setState({
			showPopup: false,
		});
	},

	render() {
		const {currentUser} = this.props;

		const eventsParticipantsDebts =
			getEventsParticipantsDebts(
				getEventBalance(this.props.eventsById[this.props.eventId]),
				this.props.eventsById[this.props.eventId]
			);
		let positiveSum = 0;
		let negativeSum = 0;
		const positiveDebts = eventsParticipantsDebts.map((debt, i) => {
			if (currentUser === debt.to) {
				positiveSum += -Math.round(debt.sum);
				return (
					<BalanceListItem
						key={i}
						sum={-Math.round(debt.sum)}
						participant={debt.from + ((currentUser === debt.from && ' (Вы)') || '')}
						debtType="positive"
						onClick={() => this.showRepayPopup(debt)}
					/>
				);
			}
		});

		const negativeDebts = eventsParticipantsDebts.map((debt, i) => {
			if (currentUser === debt.from) {
				negativeSum += -Math.round(debt.sum);
				return (
					<BalanceListItem
						key={i}
						sum={-Math.round(debt.sum)}
						participant={debt.to + ((currentUser === debt.to && ' (Вы)') || '')}
						debtType="negative"
						onClick={() => this.showRepayPopup(debt)}
					/>
				);
			}
		});


		return (
			<div className="balance-page">
				<BalanceCheck debts={eventsParticipantsDebts} />
				{this.state.showPopup &&
					<BalanceItemPopup
						debt={this.state.currentDebt}
						onSubmit={this.repayDebtHandler}
						onClose={() => this.closeRepayPopup()}
					/>
				}
				{(positiveSum !== 0) && <BalanceStatus text="Вам должны" sum={positiveSum} />}
				{positiveDebts}
				{(negativeSum !== 0) && <BalanceStatus text="Вы должны" sum={negativeSum} />}
				{negativeDebts}
			</div>
		);
	},
});

function mapStateToProps({events}) {
	return {
		eventsById: events.eventsById,
	};
}

export default connect(mapStateToProps)(BalancePage);
