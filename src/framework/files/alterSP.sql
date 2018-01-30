ALTER PROCEDURE [DBO].[%{FuncName}%] 
(
    %{parameters}%
)
AS
    DECLARE @F_ID INT	
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRAN
        INSERT INTO [DBO].[T_%{formNo}%] 
        (%{fields}%)
        VALUES(
        %{values}%
        )
        SET @F_ID= SCOPE_IDENTITY();
        COMMIT TRAN 
        RETURN @F_ID;
    END TRY
    BEGIN CATCH
        DECLARE @MSG NVARCHAR(MAX), @SEV INT  ;
        SELECT @MSG=ERROR_MESSAGE() ;
        SELECT @SEV= ERROR_SEVERITY();
        IF @@TRANCOUNT > 0 BEGIN
            ROLLBACK TRAN --RollBack in case of Error
        END
        RAISERROR(@MSG,@SEV , 1);
    END CATCH
END