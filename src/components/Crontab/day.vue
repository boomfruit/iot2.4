<template>
	<el-form size="small">
		<el-form-item>
			<el-radio v-model='radioValue' :label="1">
				{{ $t('components.Crontab.day.304304-0') }}
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model='radioValue' :label="2">
				{{ $t('components.Crontab.day.304304-1') }}
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model='radioValue' :label="3">
				{{ $t('components.Crontab.day.304304-2') }}
				<el-input-number v-model='cycle01' :min="1" :max="30" /> -
				<el-input-number v-model='cycle02' :min="cycle01 ? cycle01 + 1 : 2" :max="31" />{{
					$t('components.Crontab.day.304304-3') }}
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model='radioValue' :label="4">
				{{ $t('components.Crontab.day.304304-4') }}
				<el-input-number v-model='average01' :min="1" :max="30" /> {{ $t('components.Crontab.day.304304-5') }}
				<el-input-number v-model='average02' :min="1" :max="31 - average01 || 1" />
				{{ $t('components.Crontab.day.304304-6') }}
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model='radioValue' :label="5">
				{{ $t('components.Crontab.day.304304-7') }}
				<el-input-number v-model='workday' :min="1" :max="31" /> {{ $t('components.Crontab.day.304304-8') }}
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model='radioValue' :label="6">
				{{ $t('components.Crontab.day.304304-9') }}
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model='radioValue' :label="7">
				{{ $t('components.Crontab.day.304304-10') }}
				<el-select clearable v-model="checkboxList" :placeholder="$t('components.Crontab.day.304304-11')"
					multiple style="width:100%">
					<el-option v-for="item in 31" :key="item" :value="item">{{ item }}</el-option>
				</el-select>
			</el-radio>
		</el-form-item>
	</el-form>
</template>

<script>
export default {
	data() {
		return {
			radioValue: 1,
			workday: 1,
			cycle01: 1,
			cycle02: 2,
			average01: 1,
			average02: 1,
			checkboxList: [],
			checkNum: this.$options.propsData.check
		}
	},
	name: 'crontab-day',
	props: ['check', 'cron'],
	methods: {
		// 单选按钮值变化时
		radioChange() {
			('day rachange');
			if (this.radioValue !== 2 && this.cron.week !== '?') {
				this.$emit('update', 'week', '?', 'day')
			}

			switch (this.radioValue) {
				case 1:
					this.$emit('update', 'day', '*');
					break;
				case 2:
					this.$emit('update', 'day', '?');
					break;
				case 3:
					this.$emit('update', 'day', this.cycleTotal);
					break;
				case 4:
					this.$emit('update', 'day', this.averageTotal);
					break;
				case 5:
					this.$emit('update', 'day', this.workday + 'W');
					break;
				case 6:
					this.$emit('update', 'day', 'L');
					break;
				case 7:
					this.$emit('update', 'day', this.checkboxString);
					break;
			}
			('day rachange end');
		},
		// 周期两个值变化时
		cycleChange() {
			if (this.radioValue == '3') {
				this.$emit('update', 'day', this.cycleTotal);
			}
		},
		// 平均两个值变化时
		averageChange() {
			if (this.radioValue == '4') {
				this.$emit('update', 'day', this.averageTotal);
			}
		},
		// 最近工作日值变化时
		workdayChange() {
			if (this.radioValue == '5') {
				this.$emit('update', 'day', this.workdayCheck + 'W');
			}
		},
		// checkbox值变化时
		checkboxChange() {
			if (this.radioValue == '7') {
				this.$emit('update', 'day', this.checkboxString);
			}
		}
	},
	watch: {
		'radioValue': 'radioChange',
		'cycleTotal': 'cycleChange',
		'averageTotal': 'averageChange',
		'workdayCheck': 'workdayChange',
		'checkboxString': 'checkboxChange',
	},
	computed: {
		// 计算两个周期值
		cycleTotal: function () {
			const cycle01 = this.checkNum(this.cycle01, 1, 30)
			const cycle02 = this.checkNum(this.cycle02, cycle01 ? cycle01 + 1 : 2, 31, 31)
			return cycle01 + '-' + cycle02;
		},
		// 计算平均用到的值
		averageTotal: function () {
			const average01 = this.checkNum(this.average01, 1, 30)
			const average02 = this.checkNum(this.average02, 1, 31 - average01 || 0)
			return average01 + '/' + average02;
		},
		// 计算工作日格式
		workdayCheck: function () {
			const workday = this.checkNum(this.workday, 1, 31)
			return workday;
		},
		// 计算勾选的checkbox值合集
		checkboxString: function () {
			let str = this.checkboxList.join();
			return str == '' ? '*' : str;
		}
	}
}
</script>
