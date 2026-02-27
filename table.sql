 


CREATE TABLE `applicant_info` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
	`app_code` VARCHAR(16) NOT NULL DEFAULT ''  ,
	`name` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '申请人姓名'  ,
	`phone` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '申请人联系方式'  ,
	`position` VARCHAR(16) NULL DEFAULT '' COMMENT '申请人职位'  ,
	`cert_type` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '申请人证件类型'  ,
	`cert_num` VARCHAR(18) NOT NULL DEFAULT '' COMMENT '申请人证件号码 '  ,
	`company_name` VARCHAR(20) NULL DEFAULT NULL COMMENT '申请人公司名称'  ,
	`company_address` VARCHAR(126) NOT NULL DEFAULT '' COMMENT '申请人公司地址'  ,
	`business_license_num` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '营业执照号码'  ,
	`company_postcode` VARCHAR(6) NOT NULL DEFAULT '' COMMENT '申请人公司地址邮编'  ,
	`create_by` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '创建人'  ,
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_by` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '更新人'  ,
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY (`id`) USING BTREE
)
COMMENT='申请人信息表'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=9
;

CREATE TABLE `case_ac_info` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
	`data_id` BIGINT(20) NOT NULL COMMENT '数据id',
	`ac_case_no` VARCHAR(32) NULL DEFAULT NULL COMMENT '仲裁案号'  ,
	`ac_name` VARCHAR(32) NULL DEFAULT NULL COMMENT '仲裁委名称'  ,
	`org_code` VARCHAR(16) NULL DEFAULT NULL COMMENT '申请人编码'  ,
	`type` VARCHAR(32) NULL DEFAULT NULL COMMENT '案件类型'  ,
	`arbitrator` VARCHAR(16) NULL DEFAULT NULL COMMENT '仲裁员'  ,
	`secretary` VARCHAR(16) NULL DEFAULT NULL COMMENT '仲裁秘书'  ,
	`cost` DECIMAL(8,2) NULL DEFAULT NULL COMMENT '仲裁费用',
	`amount` DECIMAL(10,2) NULL DEFAULT NULL COMMENT '仲裁标的',
	`provisional_date` DATE NULL DEFAULT NULL COMMENT '暂计日',
	`accept_day` DATE NULL DEFAULT NULL COMMENT '受理日期',
	`setup_day` DATE NULL DEFAULT NULL COMMENT '立案日期',
	`organize_court_day` DATE NULL DEFAULT NULL COMMENT '组庭日期',
	`open_court_day` DATE NULL DEFAULT NULL COMMENT '开庭日期',
	`close_day` DATE NULL DEFAULT NULL COMMENT '撤案日期',
	`judge_date` DATE NULL DEFAULT NULL COMMENT '仲裁裁决日期',
	`ac_status` TINYINT(1) NOT NULL DEFAULT '2' COMMENT '0撤案 1待出裁 2已经出裁',
	`remark` VARCHAR(64) NOT NULL DEFAULT '' COMMENT '备注'  ,
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `idx_caseno` (`ac_case_no`) USING BTREE,
	INDEX `idx_data_id` (`data_id`) USING BTREE
)
COMMENT='仲裁信息'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=101
;



CREATE TABLE `court_info` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
	`court_code` INT(10) NOT NULL COMMENT '法院编号',
	`court_level` TINYINT(3) NOT NULL COMMENT '法院层级',
	`hight_court` VARCHAR(32) NULL DEFAULT NULL COMMENT '高院'  ,
	`middle_court` VARCHAR(32) NULL DEFAULT NULL COMMENT '中院'  ,
	`base_court` VARCHAR(32) NULL DEFAULT NULL COMMENT '基层'  ,
	`province_code` INT(10) NULL DEFAULT NULL COMMENT '省份编号',
	`city_code` INT(10) NULL DEFAULT NULL COMMENT '市编号',
	`address` VARCHAR(255) NULL DEFAULT NULL COMMENT '详细地址'  ,
	`postal_code` VARCHAR(10) NULL DEFAULT NULL COMMENT '邮政编码'  ,
	`work_time` VARCHAR(16) NULL DEFAULT NULL COMMENT '法院工作时间：08：00-18：00'  ,
	`reject` INT(10) NULL DEFAULT NULL COMMENT '是否存在驳回风险 0无1是',
	`web_address` VARCHAR(10) NULL DEFAULT NULL COMMENT '网站地址'  ,
	`city_type` VARCHAR(20) NULL DEFAULT NULL COMMENT '城市类型:一线/二线/三线/四线及以下'  ,
	`population` VARCHAR(255) NULL DEFAULT NULL COMMENT '人口总量'  ,
	`remark` VARCHAR(255) NULL DEFAULT NULL COMMENT '备注项'  ,
	`create_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE
)
COMMENT='执行法院信息'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=3496
;


CREATE TABLE `case_product` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`product_name` VARCHAR(16) NOT NULL COMMENT '产品名称'  ,
	`applicant_id` SMALLINT(6) NOT NULL DEFAULT '0' COMMENT '申请人ID',
	`client_name` VARCHAR(32) NOT NULL COMMENT '放款方名称'  ,
	`process_time` TIMESTAMP NULL DEFAULT NULL COMMENT '处置开始时间',
	`remark` VARCHAR(127) NULL DEFAULT NULL COMMENT '放款方简介'  ,
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `idx_product_name` (`product_name`) USING BTREE
)
COMMENT='产品表'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=14
;

CREATE TABLE `case_zx_info` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
	`data_id` BIGINT(15) NOT NULL COMMENT '数据id',
	`middle_case_no` VARCHAR(32) NULL DEFAULT NULL COMMENT '中院执行案号'  ,
	`basic_case_no` VARCHAR(32) NULL DEFAULT NULL COMMENT '基层执行案号'  ,
	`basic_flag` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '0中院执行 1基层执行',
	`middle_accept_day` DATE NULL DEFAULT NULL COMMENT '中院受理日期',
	`basic_accept_day` DATE NULL DEFAULT NULL COMMENT '基层立案时间',
	`case_step` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '案件当前阶段'  ,
	`case_status` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '当前案件状态'  ,
	`middle_court` VARCHAR(32) NULL DEFAULT '' COMMENT '中级法院'  ,
	`basic_court` VARCHAR(32) NULL DEFAULT '' COMMENT '基础法院'  ,
	`province` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '省份'  ,
	`city` VARCHAR(32) NULL DEFAULT '' COMMENT '市'  ,
	`area` VARCHAR(32) NULL DEFAULT '' COMMENT '县地区'  ,
	`penalty_interest` DECIMAL(8,2) NULL DEFAULT '0.00' COMMENT '利息罚息（违约金）',
	`delay_interest` DECIMAL(8,2) NULL DEFAULT '0.00' COMMENT '迟延履行金',
	`carryout_interset` DECIMAL(8,2) NULL DEFAULT '0.00' COMMENT '申请执行利率',
	`middle_up_judge` VARCHAR(16) NULL DEFAULT '' COMMENT '中院立案庭法官'  ,
	`middle_up_phone` VARCHAR(32) NULL DEFAULT '' COMMENT '中院立案庭电话'  ,
	`middle_ex_judge` VARCHAR(16) NULL DEFAULT '' COMMENT '中院执行庭法官'  ,
	`middle_ex_phone` VARCHAR(32) NULL DEFAULT '' COMMENT '中院执行庭电话'  ,
	`basic_up_judge` VARCHAR(16) NULL DEFAULT '' COMMENT '基院立案庭法官'  ,
	`basic_up_phone` VARCHAR(32) NULL DEFAULT '' COMMENT '基院立案庭电话'  ,
	`basic_ex_judge` VARCHAR(16) NULL DEFAULT '' COMMENT '基院执行庭法官'  ,
	`basic_ex_phone` VARCHAR(32) NULL DEFAULT '' COMMENT '基院执行庭电话'  ,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `idx_caseno` (`middle_case_no`) USING BTREE,
	INDEX `idx_data_id` (`data_id`) USING BTREE
)
COMMENT='法院执行案件信息表'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=4
;

CREATE TABLE `case_file` (
	`id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键递增',
	`data_id` BIGINT(15) NOT NULL DEFAULT '0',
	`file_path` VARCHAR(255) NOT NULL COMMENT '文件路径'  ,
	`remak` VARCHAR(126) NULL DEFAULT NULL COMMENT '备注'  ,
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `idx_data_id` (`data_id`) USING BTREE
)
COMMENT='案件文件'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=2392
;


CREATE TABLE `contact_record` (
	`id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
	`case_id` INT(11) NOT NULL DEFAULT '0' COMMENT '案件ID',
	`user_id` SMALLINT(6) NOT NULL DEFAULT '0' COMMENT '操作人ID',
	`product_id` SMALLINT(6) NOT NULL DEFAULT '0' COMMENT '委托公司ID',
	`org_id` SMALLINT(6) NOT NULL DEFAULT '0' COMMENT '坐席公司ID',
	`group_id` SMALLINT(6) NOT NULL DEFAULT '0' COMMENT '坐席组ID',
	`contact_type` TINYINT(4) NOT NULL DEFAULT '1' COMMENT '坐席方式 (1电话催收, 2微信, 3网查)',
	`contact_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '触达时间',
	`contact_target_type` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '触达对象关系'  ,
	`contact_target_name` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '触达对象姓名'  ,
	`contact_target_phone` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '触达对象电话'  ,
	`contact_target_address` VARCHAR(127) NOT NULL DEFAULT '' COMMENT '触达对象联系地址'  ,
	`contact_target_detail` VARCHAR(127) NOT NULL DEFAULT '' COMMENT '触达对象明细 (冗余字段,方便页面展示使用)'  ,
	`call_status` TINYINT(4) NOT NULL DEFAULT '0' COMMENT '电话接通状态 1正常接通 2无人接听 3关机 4挂机 5停机 6 正在通话 7来电提醒 8空号 9暂时无法接通 10呼叫限制, 20通话中挂断',
	`repay_wish` TINYINT(4) NOT NULL DEFAULT '0' COMMENT '触达结果 (未接通情况下 1:需跟进 2 无需跟进 还款: 11承诺还款, 12已还款-还款已收到, 13客称已还款-平台处理中, 14违诺或跳票, 15无还款意愿 || 协调: 21接听人承诺转告债务人, 22有还款意愿无还款能力, 23是借款本人但否认借款（个人信息被盗用）, 24否认本人，且不认识借款人, 25否认本人但认识借款人, 26接听人态度恶劣-无法沟通, 27号码易主，且接听人不认识债务人 || 意外: 31借款人入狱或死亡, 32借款人因病住院或意外伤残, 33其他)',
	`ptp_money` DECIMAL(10,2) NOT NULL DEFAULT '0.00' COMMENT 'PTP金额(承诺还款金额)',
	`ptp_time` DATETIME NULL DEFAULT NULL COMMENT 'PTP时间(承诺还款时间)',
	`next_contact_type` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '下次跟进策略 (0未选择, 1需跟进, 2无需跟进)',
	`next_contact_time` DATETIME NULL DEFAULT NULL COMMENT '下次跟进时间',
	`new_attr` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '是否为新增联系人 (0否, 1是)',
	`call_id` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '话单ID'  ,
	`current_case_total` DECIMAL(10,2) NOT NULL DEFAULT '0.00' COMMENT '写触达时案件金额',
	`current_case_overdue_day` SMALLINT(6) NOT NULL DEFAULT '0' COMMENT '写触达时案件逾期天数',
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `idx_case_id` (`case_id`) USING BTREE,
	INDEX `idx_repay_wish` (`repay_wish`) USING BTREE
)
COMMENT='电话触达记表'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=9
;

CREATE TABLE `case_check_apply` (
	`id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id',
	`case_id` INT(8) UNSIGNED NOT NULL COMMENT '案件id',
	`sno` VARCHAR(15) NOT NULL COMMENT '流水号'  ,
	`voucher_money` DECIMAL(10,2) UNSIGNED NOT NULL COMMENT '凭证金额',
	`repay_date` DATE NOT NULL COMMENT '还款日期',
	`repay_way` VARCHAR(64) NOT NULL COMMENT '还款方式'  ,
	`repay_type` VARCHAR(16) NULL DEFAULT NULL COMMENT '全部结清  部分还款 '  ,
	`remitter` VARCHAR(20) NOT NULL COMMENT '汇款人'  ,
	`remitter_relation` CHAR(1) NOT NULL COMMENT '汇款人与客户的关系(1:直系亲属，2:朋友，3:同事，4:本人，5:机构代还)'  ,
	`remitter_phone` VARCHAR(12) NOT NULL COMMENT '汇款人手机号'  ,
	`respondent_id` INT(8) UNSIGNED NOT NULL COMMENT '债务人id',
	`apply_user_id` SMALLINT(5) UNSIGNED NOT NULL COMMENT '提交申请人id',
	`product_id` SMALLINT(5) NOT NULL COMMENT '产品id(资方id)',
	`org_id` SMALLINT(5) NOT NULL COMMENT '公司id(机构id)',
	`status` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '申请状态(0:待组长审批,1:待财务审批,2:审批通过,3:财务审批不通过,4:已撤销申请)',
	`remark` VARCHAR(64) NULL DEFAULT NULL COMMENT '备注'  ,
	`request_remark` VARCHAR(127) NULL DEFAULT NULL COMMENT '申请备注'  ,
	`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `idx_apply_user_id` (`apply_user_id`) USING BTREE COMMENT '提交用户id索引',
	INDEX `idx_debtor_id` (`respondent_id`) USING BTREE COMMENT '债务人id索引'
)
COMMENT='案件对账申请表'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=5
;




CREATE TABLE `loan_contract` (
	`id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
	`data_id` BIGINT(15) NOT NULL DEFAULT '0' COMMENT '案件ID',
	`loan_no` VARCHAR(64) NOT NULL COMMENT '企业业务唯一表示'  ,
	`product_id` TINYINT(3) NOT NULL COMMENT '企业编码',
	`over_date` DATE NOT NULL COMMENT '逾期日期',
	`debt_amount` DECIMAL(10,2) NOT NULL DEFAULT '0.00' COMMENT '借款金额',
	`loan_amount` DECIMAL(10,2) NULL DEFAULT NULL COMMENT '放款金额',
	`period` TINYINT(3) NOT NULL COMMENT '借款时长',
	`contract_time` VARCHAR(16) NULL DEFAULT NULL COMMENT '合同签订时间'  ,
	`borrow_start_time` VARCHAR(16) NULL DEFAULT NULL COMMENT '借款开始时间'  ,
	`borrow_end_time` VARCHAR(16) NULL DEFAULT NULL COMMENT '借款结束时间'  ,
	`year_rate` DECIMAL(10,4) NULL DEFAULT NULL COMMENT '借款年利率',
	`month_rate` DECIMAL(10,4) NULL DEFAULT NULL COMMENT '借款年利率',
	`actual_borrow_time` DATE NULL DEFAULT NULL COMMENT '实际到账时间（放款时间）',
	`total_interest_amount` DECIMAL(10,2) NOT NULL COMMENT '还款本息',
	`repayment_amount` DECIMAL(10,2) NULL DEFAULT NULL COMMENT '还款本金',
	`repayment_interest` DECIMAL(10,6) NULL DEFAULT NULL COMMENT '还款利息',
	`borrow_amount` DECIMAL(10,2) NULL DEFAULT NULL COMMENT '尚欠本金',
	`interest_amount` DECIMAL(10,2) NULL DEFAULT NULL COMMENT '尚欠利息',
	`borrow_purpose` VARCHAR(126) NULL DEFAULT NULL COMMENT '借款用途'  ,
	`repay_way` VARCHAR(30) NULL DEFAULT NULL COMMENT '还款方式'  ,
	`remark` VARCHAR(255) NULL DEFAULT NULL COMMENT '备注'  ,
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	PRIMARY KEY (`id`) USING BTREE
)
COMMENT='借款合同信息'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=101
;


CREATE TABLE `respondent` (
	`id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
	`data_id` BIGINT(15) NOT NULL DEFAULT '0',
	`name` VARCHAR(16) NOT NULL COMMENT '名字'  ,
	`idcard` VARCHAR(20) NOT NULL COMMENT '被申请人身份证'  ,
	`sex` TINYINT(2) NULL DEFAULT NULL COMMENT '性别 0女 1男',
	`cert_address` VARCHAR(60) NOT NULL COMMENT '被申请人证地址' COLLATE 'utf8mb4_estonian_ci',
	`phone` VARCHAR(16) NOT NULL COMMENT '被申请人电话'  ,
	`email` VARCHAR(64) NULL DEFAULT NULL COMMENT '联系邮箱'  ,
	`provinces` VARCHAR(8) NOT NULL DEFAULT '' COMMENT '户籍省份'  ,
	`city` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '户籍城市'  ,
	`home_addr` VARCHAR(127) NULL DEFAULT '' COMMENT '家庭地址'  ,
	`work_info` VARCHAR(127) NULL DEFAULT '' COMMENT '工作单位'  ,
	`work_addr` VARCHAR(127) NULL DEFAULT '' COMMENT '单位地址'  ,
	`remark` VARCHAR(64) NULL DEFAULT '' COMMENT '备注'  ,
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	PRIMARY KEY (`id`) USING BTREE
)
COMMENT='被申请人'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=101
;


CREATE TABLE `work_order` (
	`id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '工单编号',
	`case_id` INT(8) NOT NULL DEFAULT '0' COMMENT '案件编号',
	`order_type` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '工单类型；1-投诉；2-协商还款；3-信息报备；4-客户回访',
	`order_status` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '工单状态；1-解决中；2-已解决',
	`phone` VARCHAR(16) NULL DEFAULT NULL COMMENT '来电手机号'  ,
	`processor` SMALLINT(5) NOT NULL DEFAULT '0' COMMENT '处理人',
	`org_id` SMALLINT(5) NOT NULL DEFAULT '0' COMMENT '处理人机构id',
	`committer` SMALLINT(5) NOT NULL DEFAULT '0' COMMENT '提交人',
	`user_read` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '工单处理人是否已读（0未读，1已读）',
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '新建时间',
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY (`id`) USING BTREE
)
COMMENT='工单表'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=6
;


CREATE TABLE `work_order_record` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '工单流转记录编号',
	`order_id` INT(8) NOT NULL DEFAULT '0' COMMENT '工单编号',
	`record_type` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '工单流转类型；1-工单提交；2-工单流转；3-工单已解决',
	`record_remark` VARCHAR(127) NOT NULL DEFAULT '' COMMENT '工单流转说明'  ,
	`processor` SMALLINT(5) NOT NULL DEFAULT '0' COMMENT '处理人',
	`user_id` SMALLINT(5) NOT NULL DEFAULT '0' COMMENT '操作人',
	`op_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '操作时间',
	PRIMARY KEY (`id`) USING BTREE
)
COMMENT='工单流转记录表'
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=8
;
