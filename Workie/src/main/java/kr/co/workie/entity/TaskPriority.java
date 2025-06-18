package kr.co.workie.entity;

public enum TaskPriority {
    LOW("낮음"),
    MEDIUM("보통"),
    HIGH("높음");

    private final String displayName;

    TaskPriority(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}