--FIRST create field in SUPPLIERS master to hold SM_ID
alter table T_SUPPLIERS add sm_id int null;
go

declare @sm_id int, @f_id int; 
declare @code varchar(100), @nm varchar(500), @ADR VARCHAR(500), @DIST INT, @AREA INT, @TEL VARCHAR(100), @BUSS INT, @ACCID INT
declare tbl cursor for 
select F_CODE, F_NAmE,F_adDrESS, F_district, F_area, F_tel,F_businessType, F_AccountID , f_id from T_Suppliers tc order by F_cODE;
open tbl;
FETCH NEXT FROM tbl INTO @code, @nm ,@ADR, @DIST , @AREA, @TEL, @BUSS , @ACCID, @f_id;
BEGIN TRY
	begin tran
	WHILE (@@FETCH_STATUS = 0 ) BEGIN  
		select @ACCID= SM_id from T_Accounts_Master where f_id=@ACCID
		exec @sm_id =fun_169 @f_108=@code, @f_109=@nm , @f_110=@ADr,	@F_111=@DIST, @F_112 =@AREA ,@F_113 =@TEL, @F_114 =@BUSS,@F_115 =@ACCID    ;

		FETCH NEXT FROM tbl INTO @code, @nm ,@ADR, @DIST , @AREA, @TEL, @BUSS , @ACCID, @f_id;
	end
	commit tran;
end try
BEGIN CATCH
        DECLARE @MSG NVARCHAR(MAX), @SEV INT  ;
        SELECT @MSG=ERROR_MESSAGE() ;
        SELECT @SEV= ERROR_SEVERITY();
        IF @@TRANCOUNT > 0 BEGIN
            ROLLBACK TRAN --RollBack in case of Error
        END
        RAISERROR(@MSG,@SEV , 1);
END CATCH
close TBL;
deallocate tbl;
go

SELECT T25.[F_ID]
      ,[F_108]
      ,[F_109]
      ,[F_110]
      ,[F_111], F111.F_VAL
      ,[F_112], F112.F_VAL
      ,[F_113]
      ,[F_114],F114.F_VAL
      ,[F_115],F115.F_93
  FROM [SM_769068897].[dbo].[T_25]	 T25
  LEFT OUTER JOIN T_SM_ENUMS F111 ON T25.F_111= F111.F_ID
  LEFT OUTER JOIN T_SM_ENUMS F112 ON T25.F_112=F112.F_ID
  LEFT OUTER JOIN T_SM_ENUMS F114 ON T25.F_114=F114.F_ID
  LEFT OUTER JOIN T_15 F115 ON T25.F_115=F115.F_ID
