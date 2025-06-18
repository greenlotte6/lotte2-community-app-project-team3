package kr.co.workie.entity;

public enum TaskStatus {
    TODO("할 일"),
    PROGRESS("진행중"),
    REVIEW("검토중"),
    DONE("완료");

    private final String displayName;

    TaskStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

