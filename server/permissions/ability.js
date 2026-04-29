import { defineAbility } from '@casl/ability';

export const defineAbilitiesFor = (user) => {
  const { role } = user;

  const builder = new AbilityBuilder(defineAbility);

  if (role === 'admin') {
    builder.can('manage', 'all');
  } else if (role === 'hr') {
    builder.can('read', ['Employee', 'LeaveRequest', 'Attendance', 'User']);
    builder.can('create', ['Employee', 'LeaveRequest']);
    builder.can('update', ['Employee', 'LeaveRequest']);
    builder.can('delete', 'Employee');
    builder.can('read', 'Payroll');
  } else if (role === 'employee') {
    builder.can('read', 'Employee', { _id: user.employeeId });
    builder.can('create', 'LeaveRequest', { employeeId: user.employeeId });
    builder.can('read', 'LeaveRequest', { employeeId: user.employeeId });
    builder.can('read', 'Attendance', { employeeId: user.employeeId });
    builder.can('create', 'Attendance', { employeeId: user.employeeId });
  }

  return builder.build();
};

class AbilityBuilder {
  constructor(defineAbility) {
    this.defineAbility = defineAbility;
    this.rules = [];
  }

  can(action, subject, conditions = {}) {
    this.rules.push({ action, subject, conditions, effect: 'allow' });
    return this;
  }

  cannot(action, subject, conditions = {}) {
    this.rules.push({ action, subject, conditions, effect: 'deny' });
    return this;
  }

  build() {
    return this.defineAbility((can, cannot) => {
      this.rules.forEach((rule) => {
        if (rule.effect === 'allow') {
          can(rule.action, rule.subject, rule.conditions);
        } else {
          cannot(rule.action, rule.subject, rule.conditions);
        }
      });
    });
  }
}
